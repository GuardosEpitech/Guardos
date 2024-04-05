import React, {useEffect, useState} from "react";
import {NavigateTo} from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {Button,Typography} from '@mui/material';

import styles from "./MyAccountPage.module.scss";
import {changePassword, editProfileDetails, getProfileDetails}
  from "@src/services/profileCalls";
import {deleteRestoAccount} from "@src/services/userCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [menuDesign, setMenuDesign] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [samePwError, setSamePwError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState(null);
  const [dataChangeStatus, setDataChangeStatus] = useState(null);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const navigate = useNavigate();
  const {t, i18n} = useTranslation();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getProfileDetails(userToken)
      .then((res) => {
        setEmail(res.email);
        setName(res.username);
        setPicture(res.profilePicId);
        setMenuDesign(res.defaultMenuDesign);
        setPreferredLanguage(res.preferredLanguage || i18n.language);
      });
  };

  const handlePictureChange = (e : any) => {
    setPicture(e.target.value);
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
    if (!res) {
      isError = true;
    } else {
      localStorage.setItem('user', res);
    }

    // TODO: add image mngt

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
          document.dispatchEvent(event);
          NavigateTo('/', navigate, {});
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
              : t('pages.MyAccountPage.data-changed-failure')}
          </div>
        )}
        <div className={styles.profilePicture}>
          <label>{t('pages.MyAccountPage.profile-pic')}</label>
          <input className={styles.InputField} type="file" accept="image/*" onChange={handlePictureChange} />
          {/* Add an image preview */}
          {picture &&
              <img
                src={picture}
                alt={t('pages.MyAccountPage.pic-alt')}
                className={styles.profileImage}
              />
          }
        </div>
        <div>
          <label>{t('pages.MyAccountPage.email')}</label>
          <input className={styles.InputField} type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div>
          <label>{t('pages.MyAccountPage.name')}</label>
          <input className={styles.InputField} type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="menu-design-label">
            {t('pages.MyAccountPage.menu-design')}
          </InputLabel>
          <Select
            labelId="menu-design-label"
            id="menu-design"
            value={menuDesign}
            onChange={handleMenuDesignChange}
            label={t('pages.MyAccountPage.menu-design')}
          >
            {/*TODO: apply i18n*/}
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="fast-food">Fast Food</MenuItem>
            <MenuItem value="pizzeria">Pizzeria</MenuItem>
          </Select>
        </FormControl>
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
        <div className={passwordChangeOpen ? styles.dropdownBgColorExtended : styles.dropdownBgColorCollapsed}>
          <button className={styles.dropdownToggle} onClick={handleTogglePasswordChange}>
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
              {/* Save Password Button */}
              <div>
                <button className={styles.saveButton} onClick={handleSavePassword}>
                  {t('pages.MyAccountPage.save-pw')}
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <button className={styles.saveButton} onClick={handleSave}>
            {t('pages.MyAccountPage.save-changes')}
          </button>
        </div>
        <button
          className={styles.deleteButton}
          onClick={handleOpenDeletePopup}
        >
          {t('pages.MyAccountPage.delete-account')}
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <Typography variant="body1">{t('pages.MyAccountPage.feature-request')}</Typography>
          <Button onClick={() => window.location.href = '/feature-request'}>
            {t('pages.MyAccountPage.just-ask')}
          </Button>
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
