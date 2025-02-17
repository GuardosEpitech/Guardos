import React, {useEffect, useState} from "react";
import {NavigateTo} from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {Button,Typography} from '@mui/material';
import { IimageInterface } from "shared/models/imageInterface";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {defaultProfileImage} from 'shared/assets/placeholderImageBase64';
import {FormControlLabel} from "@mui/material";
import Switch from '@mui/material/Switch';
import styles from "./MyAccountPage.module.scss";
import {changePassword, changeTwoFactor, editProfileDetails, getProfileDetails}
  from "@src/services/profileCalls";
import {deleteRestoAccount, getPaymentMethods} from "@src/services/userCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enable, disable, setFetchMethod, auto , isEnabled} from "darkreader";
import { checkDarkMode } from "../../utils/DarkMode";
import DarkModeButton from "@src/components/DarkModeButton/DarkModeButton";

import {
  addRestoProfileImage, deleteRestoProfileImage, getImages
} from "@src/services/callImages";
import {useTranslation} from "react-i18next";

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
  const [menuDesign, setMenuDesign] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [twoFactor, setTwoFactor] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [samePwError, setSamePwError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState(null);
  const [dataChangeStatus, setDataChangeStatus] = useState(null);
  const [saveFailureType, setSaveFailureType] = useState(null);
  const [paymentIsSet, setPaymentIsSet] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const navigate = useNavigate(); useState<boolean>(isEnabled());
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const {t, i18n} = useTranslation();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getProfileDetails(userToken)
      .then((res) => {
        setEmail(res.email);
        setName(res.username);
        setPicture(res.profilePicId[res.profilePicId.length - 1]);
        setMenuDesign(res.defaultMenuDesign);
        setPreferredLanguage(res.preferredLanguage || i18n.language);
        setTwoFactor(res.twoFactor === "true");
      });
    let paymentMehtods = await getPaymentMethods(userToken);
    if (paymentMehtods && paymentMehtods !== '' && paymentMehtods.length !== 0) {
      setPaymentIsSet(true);
    }
  };

  const handleEmailChange = (e : any) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e : any) => {
    setName(e.target.value);
  };

  const handleMenuDesignChange = (event : any) => {
    setMenuDesign(event.target.value);
  };

  const handleLanguageChange = (e: any) => {
    setPreferredLanguage(e.target.value);
  };

  const handleOldPasswordChange = (e: any) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleTogglePasswordChange = () => {
    // Toggle the password change dropdown
    setPasswordChangeOpen(!passwordChangeOpen);
  };

  function isValidPassword(password: string): boolean {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    return (
      password.length >= 7 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password)
    );
  }

  const handleSavePassword = async () => {
    setPwError(false);
    setSamePwError(false);
    setErrorForm(false);
    let isError = false;
    if (!isValidPassword(newPassword)) {
      setPwError(true);
      isError = true;
    }
    if (newPassword !== confirmPassword) {
      setSamePwError(true);
      isError = true;
    }
    if (isError) {
      return;
    }
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }
    const res = await changePassword(userToken, oldPassword, newPassword);
    if (!res) {
      setErrorForm(true);
      setPasswordChangeStatus("failed");
    } else {
      setPasswordChangeStatus("success");
      localStorage.setItem('user', res);
    }
  };

  const handleSave = async () => {
    setDataChangeStatus(null);
    setSaveFailureType(null);
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      setDataChangeStatus("failed");
      return;
    }
    const res = await editProfileDetails(userToken, {
      username: name,
      email: email,
      defaultMenuDesign: menuDesign,
      preferredLanguage: preferredLanguage
    });
    i18n.changeLanguage(preferredLanguage);

    let isError = false;

    if (typeof res === "string") {
      if (!res) {
        isError = true;
      } else {
        localStorage.setItem('user', res);
      }
    } else if (Array.isArray(res) && res.length === 2) {
      isError = true;
      if (res[0] === true) {
        setSaveFailureType("email");
      } else {
        setSaveFailureType("username");
      }
    } else {
      isError = true;
    }

    if (isError) {
      setDataChangeStatus("failed");
    } else {
      setDataChangeStatus("success");

    }
  };

  const handleDeleteAccount = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    deleteRestoAccount(userToken)
      .then(res => {
        if (res !== null) {
          const event = new Event('loggedOut');
          localStorage.removeItem('user');
          localStorage.removeItem('visitedRestoBefore');
          document.dispatchEvent(event);
          const userEvent = new CustomEvent("setUserToken");
          window.dispatchEvent(userEvent);
          NavigateTo('/login', navigate, {});
        }
      });
    setOpenDeletePopup(false);
  };

  const handleOpenDeletePopup = () => {
    setOpenDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setOpenDeletePopup(false);
  };

  const toggleDarkMode = () => {
    const darkModeEnabled = localStorage.getItem('darkMode');
    setDarkMode(!darkMode);
    if (darkModeEnabled == 'false' || darkModeEnabled == null ) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  };

  const enableDarkMode = () => {
    localStorage.setItem('darkMode', JSON.stringify(true));
    setIsDarkMode(true);
    checkDarkMode();
  };

  const disableDarkMode = () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    setIsDarkMode(false);
    disable();
  };

  useEffect(() => {
    const loadImages = async () => {
      if (picture) {
        try {
          const answer = await getImages([picture]);
          //@ts-ignore
          setProfilePic(answer.map((img) => ({
            base64: img.base64,
            contentType: img.contentType,
            filename: img.filename,
            size: img.size,
            uploadDate: img.uploadDate,
            id: img.id,
          })));
        } catch (error) {
          console.error("Failed to load images", error);
          setProfilePic([{
            base64: defaultProfileImage,
            contentType: "image/png",
            filename: "profile-placeholder.png",
            size: 0,
            uploadDate: "",
            id: 0,
          }]);
        }
      } else {
        setProfilePic([{
          base64: defaultProfileImage,
          contentType: "image/png",
          filename: "profile-placeholder.png",
          size: 0,
          uploadDate: "",
          id: 0,
        }]);
      }
    };

    loadImages();
  }, [picture]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = convertImageToBase64(file);
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }

      base64.then((result) => {
        addRestoProfileImage(userToken, file.name,
          file.type, file.size, result)
          .then(r => {
            setProfilePic([{ base64: result, contentType: file.type,
              filename: file.name, size: file.size,
              uploadDate: "0", id: r.message }]);
            if (picture) {
              deleteRestoProfileImage(picture, userToken);
            }
            setPicture(r.message);
          });
      });
    }
  };

  function handeFileDelete() {
    if (picture) {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }

      deleteRestoProfileImage(picture, userToken);
      displayImageFromBase64(defaultProfileImage, "ProfileImg");
      setProfilePic([{
        base64: defaultProfileImage,
        contentType: "png",
        filename: "profile-placeholder.png",
        size: 0,
        uploadDate: "0",
        id: 0,
      }]);
    }
    else {
      console.log("No image to delete");
    }
  }

  function toggleTwoFactor() {
    console.log("Toggling two factor");
    changeTwoFactor(localStorage.getItem('user'), twoFactor
      ? "false" : "true")
      .then(r => {
        setTwoFactor(!twoFactor);
      });
  }

  const errorExplanation = () => {
    switch (saveFailureType) {
    case 'email':
      return t('pages.MyAccountPage.email-taken');
    case 'username':
      return t('pages.MyAccountPage.username-taken');
    default:
      return '';
    }
  };

  return (
    <div className={styles.MyAccountPage}>
      <div className={styles.profileSection}>
        <h1>{t('pages.MyAccountPage.account-page')}</h1>
        {dataChangeStatus !== null && (
          <div
            className={`${styles.dataChangeStatus} ${
              dataChangeStatus === 'success' ? styles.success : styles.error
            }`}
          >
            {dataChangeStatus === 'success'
              ? t('pages.MyAccountPage.data-changed-success')
              : (t('pages.MyAccountPage.data-changed-failure') + errorExplanation())}
          </div>
        )}
        <img
          id={"img-" + (profilePic && profilePic[0] ? profilePic[0].filename : "default")}
          src={profilePic.length > 0 ? profilePic[0].base64 : defaultProfileImage}
          className={styles.ImageDimensions}
          alt={t('pages.MyAccountPage.pic-alt')}
        />
        <div className={styles.imageButtonContainer}>
          <button className={styles.imageButton} onClick={() => {
            document.getElementById('fileInput')
              .click();
          }}>
            {t('pages.MyAccountPage.change-img')}
            <input
              id="fileInput"
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleFileChange}/>
          </button>
          <button className={styles.deleteButton} onClick={handeFileDelete}>
            {t('pages.MyAccountPage.delete-img')}
          </button>
        </div>
        <div className={styles.emailInput}>
          <label>{t('pages.MyAccountPage.email')}</label>
          <input className={styles.InputField} type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div className={styles.nameInput}>
          <label>{t('pages.MyAccountPage.name')}</label>
          <input className={styles.InputField} type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="langauge-label">
            {t('pages.MyAccountPage.preferred-language')}
          </InputLabel>
          <Select
            labelId="language-label"
            id="language"
            value={preferredLanguage}
            onChange={handleLanguageChange}
            label={t('pages.MyAccountPage.language')}
          >
            <MenuItem value="en">{t('common.english')}</MenuItem>
            <MenuItem value="de">{t('common.german')}</MenuItem>
            <MenuItem value="fr">{t('common.french')}</MenuItem>
          </Select>
        </FormControl>

        <div className={styles.buttonContainer}>
          <FormControlLabel
            control={<Switch checked={twoFactor} onChange={toggleTwoFactor}/>}
            label={twoFactor ? t('pages.MyAccountPage.two-factor-deactivate')
              : t('pages.MyAccountPage.two-factor-activate')}
          />
          <div className={passwordChangeOpen ? styles.dropdownBgColorExtended : styles.dropdownBgColorCollapsed}>
            <button className={`${styles.deleteButton} ${styles.uniformButton} ${styles.saveChangesButton}`} onClick={handleSave}>
              {t('pages.MyAccountPage.save-changes')}
            </button>
            <button className={`${styles.deleteButton} ${styles.uniformButton}`} onClick={handleTogglePasswordChange}>
              {t('pages.MyAccountPage.change-pw')}
            </button>
            {passwordChangeOpen && (
              <div>
                {passwordChangeStatus && (
                  <div
                    className={`${styles.passwordChangeStatus} ${
                      passwordChangeStatus === 'success' ? styles.success : styles.error
                    }`}
                  >
                    {passwordChangeStatus === 'success'
                      ? t('pages.MyAccountPage.change-pw-success')
                      : t('pages.MyAccountPage.change-pw-failure')}
                  </div>
                )}
                <TextField
                  className={styles.fullWidth}
                  label={t('pages.MyAccountPage.old-pw')}
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  margin="normal"
                  error={errorForm}
                  helperText={errorForm ? t('pages.MyAccountPage.incorrect-pw') : ''}
                />
                <TextField
                  className={styles.fullWidth}
                  label={t('pages.MyAccountPage.new-pw')}
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  margin="normal"
                  error={pwError}
                  helperText={pwError ? t('pages.MyAccountPage.wrong-pw-format') : ''}
                />
                <TextField
                  className={styles.fullWidth}
                  label={t('pages.MyAccountPage.confirm-pw')}
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  margin="normal"
                  error={samePwError}
                  helperText={samePwError ? t('pages.MyAccountPage.no-match-pw') : ''}
                />
                <div>
                  <button className={`${styles.deleteButton} ${styles.uniformButton}`} onClick={handleSavePassword}>
                    {t('pages.MyAccountPage.save-pw')}
                  </button>
                </div>
              </div>
            )}
          </div>
          {paymentIsSet ? (
            <button className={`${styles.deleteButton} ${styles.uniformButton}`} onClick={() => { navigate('/subscriptions'); }}>
              {t('pages.MyAccountPage.subscriptions')}
            </button>
          ) : (
            <div className={styles.emptyDiv}></div>
          )}
          <button className={`${styles.deleteButton} ${styles.uniformButton}`} onClick={() => { navigate('/payment'); }}>
            {t('pages.MyAccountPage.payBtn')}
          </button>
        </div>

        <div className={styles.helpButtons}>
          <Typography variant="body1">{t('pages.MyAccountPage.feature-request')}</Typography>
          <Button onClick={() => { navigate('/feature-request'); }}>
            {t('pages.MyAccountPage.just-ask')}
          </Button>
        </div>
        <div className={styles.helpButtons}>
          <Button onClick={() => { navigate('/support'); }}>
            {t('pages.MyAccountPage.User-Support')}
          </Button>
        </div>
        <div className={styles.darkModeButton}>
          <FormControlLabel
            control={<DarkModeButton checked={darkMode} onChange={toggleDarkMode}
              inputProps={{'aria-label': 'controlled'}} sx={{m: 1}}/>}
            label={t('pages.MyAccountPage.enable-dark-mode')}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
              className={styles.deleteButton}
              onClick={handleOpenDeletePopup}
            >
            {t('pages.MyAccountPage.delete-account')}
          </button>
        </div>
      </div>

      <Dialog
        open={openDeletePopup}
        onClose={handleCloseDeletePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('pages.MyAccountPage.delete-account')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('pages.MyAccountPage.confirm-delete-account')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteAccount} autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyAccountPage;
