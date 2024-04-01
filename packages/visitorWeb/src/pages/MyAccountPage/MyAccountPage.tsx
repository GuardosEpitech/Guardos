import React, { useState, useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {Button,Typography} from '@mui/material';

import styles from "./MyAccountPage.module.scss";
import {deleteAccount} from "@src/services/userCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {changeVisitorPassword, editVisitorProfileDetails, getVisitorProfileDetails} from "@src/services/profileCalls";
import TextField from "@mui/material/TextField";
import {getDishFavourites, getRestoFavourites} from "@src/services/favourites";
import RestoCard from "@src/components/RestoCard/RestoCard";
import Dish from "@src/components/menu/Dish/Dish";
import { IimageInterface } from "shared/models/imageInterface";
import {addProfileImage, deleteProfileImage, getImages} from "@src/services/imageCalls";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {defaultProfileImage} from 'shared/assets/placeholderImageBase64';

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [picture, setPicture] = useState(null);
  const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const navigate = useNavigate();
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

  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");

  useEffect(() => {
    fetchProfileData();
    fetchFavoriteRestaurants();
    fetchFavoriteDishes();
  }, []);

  const fetchProfileData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getVisitorProfileDetails(userToken)
      .then((res) => {
        setEmail(res.email);
        setName(res.username);
        setCity(res.city);
        setSelectedOptions(res.allergens);
        setPicture(res.profilePicId);
        setPreferredLanguage(res.preferredLanguage);
      });
  };

  const fetchFavoriteRestaurants = async () => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const favorites = await getRestoFavourites(userToken);
    setFavoriteRestaurants(favorites);
  };

  const fetchFavoriteDishes = async () => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const favorites = await getDishFavourites(userToken);
    setFavoriteDishes(favorites);
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  const handleEmailChange = (e : any) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e : any) => {
    setName(e.target.value);
  };

  const handleCityChange = (e : any) => {
    setCity(e.target.value);
  };

  const handleSelectChange = (event : any) => {
    setSelectedOptions(event.target.value);
  };

  const handleLanguageChange = (event : any) => {
    setPreferredLanguage(event.target.value);
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
    const res = await changeVisitorPassword(userToken, oldPassword, newPassword);
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
    const res = await editVisitorProfileDetails(userToken, {
      username: name,
      email: email,
      city: city,
      allergens: selectedOptions,
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
    deleteAccount(userToken).then(res => {
      if (res !== null) {
        const event = new Event('loggedOut');
        localStorage.removeItem('user');
        document.dispatchEvent(event);
        NavigateTo('/', navigate, {})
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
            addProfileImage(userToken, file.name,
              file.type, file.size, result)
              .then(r => {
                setProfilePic([{ base64: result, contentType: file.type,
                  filename: file.name, size: file.size,
                  uploadDate: "0", id: r.message }]);
                if (picture) {
                  deleteProfileImage(picture, userToken);
                }
                setPicture(r.message);
              });
      })
    }
  };

  function handeFileDelete() {
    if (picture) {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }

      deleteProfileImage(picture, userToken);
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
        <img
          src={profilePic.length > 0 ? profilePic[0].base64 : defaultProfileImage}
          className={styles.ImageDimensions}
          alt="Resto Img"
        />
        <div className={styles.imageButtonContainer}>
          <button className={styles.imageButton} onClick={() => { document.getElementById('fileInput').click(); }}>
            Change Image
            <input
              id="fileInput"
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleFileChange}/>
          </button>
          <button className={styles.deleteButton} onClick={handeFileDelete}>
            Delete Image
          </button>
        </div>
        <div>
          <label>Email:</label>
          <input className={styles.InputField} type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div>
          <label>Name:</label>
          <input className={styles.InputField} type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <div>
          <label>City:</label>
          <input className={styles.InputField} type="text" value={city} onChange={handleCityChange} />
        </div>
        <div>
        <FormControl fullWidth className={styles.allergenInput}>
          <InputLabel id="allergens-label">Allergens</InputLabel>
          <Select
            labelId="allergens-label"
            id="allergens"
            multiple
            value={selectedOptions}
            onChange={handleSelectChange}
            label="Allergens"
          >
            {['peanut', 'gluten', 'dairy'].map((allergen) => (
              <MenuItem key={allergen} value={allergen} selected={selectedOptions.includes(allergen)}>
                {allergen}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </div>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="langauge-label">Preferred Language</InputLabel>
          <Select
            labelId="language-label"
            id="language"
            value={preferredLanguage}
            onChange={handleLanguageChange}
            label="Language"
          >
            <MenuItem value="en" selected={preferredLanguage === 'en'}>English</MenuItem>
            <MenuItem value="de" selected={preferredLanguage === 'de'}>Deutsch</MenuItem>
            <MenuItem value="fr" selected={preferredLanguage === 'fr'}>Francais</MenuItem>
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
        <button className={styles.deleteButton} onClick={handleOpenDeletePopup}>Delete Account</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <Typography variant="body1">You need a new feature? </Typography>
          <Button onClick={() => window.location.href = '/feature-request'}>
          Just ask for it !
          </Button>
      </div>   
      </div>         
      <div className={styles.restaurantSection}>
        {/* Tabs for Favorite Restaurants and Dishes */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "restaurants" ? styles.activeTab : "none"}
            onClick={() => handleTabChange("restaurants")}
          >
            Favorite Restaurants
          </button>
          <button
            className={activeTab === "dishes" ? styles.activeTab : "none"}
            onClick={() => handleTabChange("dishes")}
          >
            Favorite Dishes
          </button>
        </div>

        {/* Display Favorite Restaurants or Dishes based on the active tab */}
        <div className={styles.favoriteListContainer}>
          {activeTab === "restaurants" && (
            <div className={styles.favoriteList}>
              <h2>Favorite Restaurants</h2>
              {favoriteRestaurants.map((restaurant) => (
                <RestoCard
                  key={restaurant.id}
                  resto={restaurant}
                  isFavourite={true}
                  dataIndex={0}
                />
              ))}
            </div>
          )}

          {activeTab === "dishes" && (
            <div className={styles.favoriteList}>
              <h2>Favorite Dishes</h2>
              {favoriteDishes.map((dish) => {
                return (
                  <Dish
                    key={dish.dish.uid}
                    dishName={dish.dish.name}
                    dishAllergens={dish.dish.allergens}
                    dishDescription={dish.dish.description}
                    options={dish.dish.options}
                    picturesId={dish.dish.picturesId}
                    price={dish.dish.price}
                    restoID={dish.restoID}
                    dishID={dish.dish.uid}
                    isFavourite={true}
                  />
                )
              }

              )}
            </div>
          )}
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
