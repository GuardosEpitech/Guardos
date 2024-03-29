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

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [menuDesign, setMenuDesign] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');

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
        setPreferredLanguage(res.preferredLanguage);
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
        <h1>Account Page</h1>
        {dataChangeStatus !== null && (
          <div
            className={`${styles.dataChangeStatus} ${
              dataChangeStatus === 'success' ? styles.success : styles.error
            }`}
          >
            {dataChangeStatus === 'success'
              ? 'Profile details changed successfully!'
              : 'Failed to change profile details.'}
          </div>
        )}
        <div className={styles.profilePicture}>
          <label>Profile Picture:</label>
          <input className={styles.InputField} type="file" accept="image/*" onChange={handlePictureChange} />
          {/* Add an image preview */}
          {picture && <img src={picture} alt="Profile" className={styles.profileImage} />}
        </div>
        <div>
          <label>Email:</label>
          <input className={styles.InputField} type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div>
          <label>Name:</label>
          <input className={styles.InputField} type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="menu-design-label">Menu Design</InputLabel>
          <Select
            labelId="menu-design-label"
            id="menu-design"
            value={menuDesign}
            onChange={handleMenuDesignChange}
            label="Menu Design"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="fast-food">Fast Food</MenuItem>
            <MenuItem value="pizzeria">Pizzeria</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="langauge-label">Preferred Language</InputLabel>
          <Select
            labelId="language-label"
            id="language"
            value={preferredLanguage}
            onChange={handleLanguageChange}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="de">Deutsch</MenuItem>
            <MenuItem value="fr">Francais</MenuItem>
          </Select>
        </FormControl>
        <div className={passwordChangeOpen ? styles.dropdownBgColorExtended : styles.dropdownBgColorCollapsed}>
          <button className={styles.dropdownToggle} onClick={handleTogglePasswordChange}>
            Change Password
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
                    ? 'Password changed successfully!'
                    : 'Failed to change password. Please check your old password and try again.'}
                </div>
              )}
              <TextField
                className={styles.fullWidth}
                label="Old Password"
                name="oldPassword"
                type="password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                margin="normal"
                error={errorForm}
                helperText={errorForm ? 'Incorrect password' : ''}
              />
              <TextField
                className={styles.fullWidth}
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                margin="normal"
                error={pwError}
                helperText={pwError ? 'Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters' : ''}
              />
              <TextField
                className={styles.fullWidth}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                margin="normal"
                error={samePwError}
                helperText={samePwError ? 'Passwords do not match' : ''}
              />
              {/* Save Password Button */}
              <div>
                <button className={styles.saveButton} onClick={handleSavePassword}>
                  Save Password
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
        </div>
        <button
          className={styles.deleteButton}
          onClick={handleOpenDeletePopup}
        >
          Delete Account
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <Typography variant="body1">You need a new feature? </Typography>
          <Button onClick={() => window.location.href = '/feature-request'}>
          Just ask for it !
          </Button>
        </div>
      </div>
      <Dialog
        open={openDeletePopup}
        onClose={handleCloseDeletePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup}>Cancel</Button>
          <Button onClick={handleDeleteAccount} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyAccountPage;
