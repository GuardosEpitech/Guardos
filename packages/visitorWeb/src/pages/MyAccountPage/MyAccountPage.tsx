import React, { useState, useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {Autocomplete, Button, Typography} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

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
import {enable, disable, setFetchMethod} from "darkreader";

import { IimageInterface } from "shared/models/imageInterface";
import {addProfileImage, deleteProfileImage, getImages} from "@src/services/imageCalls";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {defaultProfileImage} from 'shared/assets/placeholderImageBase64';
import {useTranslation} from "react-i18next";
import DarkModeButton from "@src/components/DarkModeButton/DarkModeButton";
import {addIngredient, getAllIngredients} from "@src/services/ingredientsCalls";

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [picture, setPicture] = useState(null);
  const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDislikedIngredients, setSelectedDislikedIngredients] = useState([]);
  const [dbIngredients, setDBIngredients] = useState([]);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const navigate = useNavigate();
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

  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const {t, i18n} = useTranslation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const [openAddIngredientPopup, setOpenAddIngredientPopup] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');


  useEffect(() => {
    fetchProfileData();
    fetchFavoriteRestaurants();
    fetchFavoriteDishes();
  }, []);

  const fetchProfileData = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    const res = await getAllIngredients();
    if (res) {
      const tmp = Array.from(new Set(res.map((ingredient: any) => ingredient.name)));
      setDBIngredients(tmp);
    }
    getVisitorProfileDetails(userToken)
      .then((res) => {
        setEmail(res.email);
        setName(res.username);
        setCity(res.city);
        setSelectedOptions(res.allergens);
        setSelectedDislikedIngredients(res.dislikedIngredients);
        setPicture(res.profilePicId);
        setPreferredLanguage(res.preferredLanguage || i18n.language);
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

  const handleSelectDislikedIngredientsChange = (event : any, value: any) => {
    setSelectedDislikedIngredients(value);
  };

  const handleAddIngredientPopupOpen = () => {
    setOpenAddIngredientPopup(true);
  };

  const handleAddIngredientPopupClose = () => {
    setOpenAddIngredientPopup(false);
  };

  const handleNewIngredientChange = (event: any) => {
    setNewIngredient(event.target.value);
  };

  const handleAddIngredient = async () => {
    const result = await addIngredient(newIngredient);
    if (result) {
      setDBIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      setNewIngredient('');
      handleAddIngredientPopupClose();
    }
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
      dislikedIngredients: selectedDislikedIngredients,
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
    deleteAccount(userToken).then(res => {
      if (res !== null) {
        const event = new Event('loggedOut');
        localStorage.removeItem('user');
        localStorage.removeItem('visitedBefore');
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

  const toggleDarkMode = () => {
    const darkModeEnabled = localStorage.getItem('darkMode');    
    setDarkMode(!darkMode);
    if (darkModeEnabled == 'false') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  };

  const enableDarkMode = () => {
    setFetchMethod((url) => {
      return fetch(url, {
        mode: 'no-cors',
      });
    });
    localStorage.setItem('darkMode', JSON.stringify(true));
    setIsDarkMode(true);
    enable({
      brightness: 100,
      contrast: 100,
      darkSchemeBackgroundColor: '#181a1b',
      darkSchemeTextColor: '#e8e6e3'
    },);
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
        <img
          src={profilePic.length > 0 ? profilePic[0].base64 : defaultProfileImage}
          className={styles.ImageDimensions}
          alt={t('pages.MyAccountPage.pic-alt')}
        />
        <div className={styles.imageButtonContainer}>
          <button className={styles.imageButton} onClick={() => { document.getElementById('fileInput').click(); }}>
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
        <div>
          <label>{t('pages.MyAccountPage.email')}</label>
          <input className={styles.InputField} type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div>
          <label>{t('pages.MyAccountPage.name')}</label>
          <input className={styles.InputField} type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <div>
          <label>{t('pages.MyAccountPage.city')}</label>
          <input className={styles.InputField} type="text" value={city} onChange={handleCityChange} />
        </div>
        <div>
        <FormControl fullWidth className={styles.allergenInput}>
          <InputLabel id="allergens-label">{t('pages.MyAccountPage.allergens')}</InputLabel>
          <Select
            labelId="allergens-label"
            id="allergens"
            multiple
            value={selectedOptions}
            onChange={handleSelectChange}
            label={t('pages.MyAccountPage.allergens')}
          >
            {
              // TODO: apply i18n
              ['peanut', 'gluten', 'dairy'].map((allergen) => (
              <MenuItem key={allergen} value={allergen} selected={selectedOptions.includes(allergen)}>
                {allergen}
              </MenuItem>
            ))
            }
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          id="disliked-ingredients"
          onChange={handleSelectDislikedIngredientsChange}
          options={dbIngredients ? dbIngredients : []}
          value={selectedDislikedIngredients}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('pages.MyAccountPage.disliked-ingredients')}
            />
          )}
        />
        <div style={{  display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-40px' }}>
          <Button onClick={handleAddIngredientPopupOpen}>
            {t('pages.MyAccountPage.ingredient-not-found')}
          </Button>
        </div>
        </div>
        <FormControl fullWidth className={styles.selectInput}>
          <InputLabel id="langauge-label">{t('pages.MyAccountPage.preferred-language')}</InputLabel>
          <Select
            labelId="language-label"
            id="language"
            value={preferredLanguage}
            onChange={handleLanguageChange}
            label={t('pages.MyAccountPage.language')}
          >
            <MenuItem value="en" selected={preferredLanguage === 'en'}>
              {t('common.english')}
            </MenuItem>
            <MenuItem value="de" selected={preferredLanguage === 'de'}>
              {t('common.german')}
            </MenuItem>
            <MenuItem value="fr" selected={preferredLanguage === 'fr'}>
              {t('common.french')}
            </MenuItem>
          </Select>
        </FormControl>
        <div className={styles.customButton}>
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
          <button onClick={() => window.location.href = '/subscriptions'}>
            {t('pages.MyAccountPage.subscriptions')}
          </button>
          <button onClick={() => window.location.href = '/payment'}>
            {t('pages.MyAccountPage.payBtn')}
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            {t('pages.MyAccountPage.save-changes')}
          </button>
        </div>
        <button className={styles.deleteButton} onClick={handleOpenDeletePopup}>
          {t('pages.MyAccountPage.delete-account')}
        </button>
        </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <Typography variant="body1">{t('pages.MyAccountPage.feature-request')}</Typography>
          <Button onClick={() => window.location.href = '/feature-request'}>
            {t('pages.MyAccountPage.just-ask')}
          </Button>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-10px' }}>
          <Button onClick={() => window.location.href = '/support'}>
            {t('pages.MyAccountPage.User-Support')}
          </Button>
         </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <FormControlLabel
          control={<DarkModeButton checked={darkMode} onChange={toggleDarkMode} inputProps={{ 'aria-label': 'controlled' }} sx={{ m: 1 }}/>}
          label={t('pages.MyAccountPage.enable-dark-mode')}
        />
        </div>
        </div>      
      <div className={styles.restaurantSection}>
        {/* Tabs for Favorite Restaurants and Dishes */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "restaurants" ? styles.activeTab : "none"}
            onClick={() => handleTabChange("restaurants")}
          >
            {t('pages.MyAccountPage.fav-restos')}
          </button>
          <button
            className={activeTab === "dishes" ? styles.activeTab : "none"}
            onClick={() => handleTabChange("dishes")}
          >
            {t('pages.MyAccountPage.fav-dishes')}
          </button>
        </div>

        {/* Display Favorite Restaurants or Dishes based on the active tab */}
        <div className={styles.favoriteListContainer}>
          {activeTab === "restaurants" && (
            <div className={styles.favoriteList}>
              <h2>{t('pages.MyAccountPage.fav-restos')}</h2>
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
              <h2>{t('pages.MyAccountPage.fav-dishes')}</h2>
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
                    discount={dish.dish.discount}
                    validTill={dish.dish.validTill}
                    combo={dish.combo}
                    isTopLevel={true}
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
        <DialogTitle id="alert-dialog-title">
          {t('pages.MyAccountPage.delete-account')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('pages.MyAccountPage.confirm-delete-account')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteAccount} autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddIngredientPopup}
        onClose={handleAddIngredientPopupClose}
        aria-labelledby="add-ingredient-dialog-title"
        aria-describedby="add-ingredient-dialog-description"
      >
        <DialogTitle id="add-ingredient-dialog-title">
          {t('pages.MyAccountPage.add-new-ingredient')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-ingredient"
            label={t('pages.MyAccountPage.enter-ingredient')}
            type="text"
            fullWidth
            value={newIngredient}
            onChange={handleNewIngredientChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddIngredientPopupClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleAddIngredient}>
            {t('common.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyAccountPage;
