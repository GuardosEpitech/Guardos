import React, { useState, useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FormControl from '@mui/material/FormControl';
import {Alert, Autocomplete, Button, Divider, Snackbar, Typography} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "./MyAccountPage.module.scss";
import {deleteAccount, getPaymentMethods} from "@src/services/userCalls";
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
import {disable, enable, setFetchMethod} from "darkreader";

import {IimageInterface} from "shared/models/imageInterface";
import {addProfileImage, deleteProfileImage, getImages, deleteProfileImageDB} from "@src/services/imageCalls";
import {convertImageToBase64, displayImageFromBase64} from "shared/utils/imageConverter";
import {defaultProfileImage} from 'shared/assets/placeholderImageBase64';
import {useTranslation} from "react-i18next";
import DarkModeButton from "@src/components/DarkModeButton/DarkModeButton";
import {addIngredient, getAllIngredients} from "@src/services/ingredientsCalls";
import {deleteRatingDataUser, getRatingDataUser} from "@src/services/ratingCalls";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { defaultRestoImage } from "shared/assets/placeholderImageBase64";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
const PageBtn = () => {
  return createTheme({
    palette: {
      primary: {
        main: "#6d071a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
  });
};

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
  const [saveFailureType, setSaveFailureType] = useState(null);
  const [ingredientFeedback, setIngredientFeedback] = useState('');

  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [userReview, setUserReview] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [paymentIsSet, setPaymentIsSet] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [openReviewPopUp, setopenReviewPopUp] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const {t, i18n} = useTranslation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(true);

  const [openAddIngredientPopup, setOpenAddIngredientPopup] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const allAllergens = [
    'celery',
    'gluten',
    'crustaceans',
    'eggs',
    'fish',
    'lupin',
    'milk',
    'molluscs',
    'mustard',
    'peanuts',
    'sesame',
    'soybeans',
    'sulphites',
    'tree nuts',
  ];

  const [restaurantImages, setRestaurantImages] = useState<Record<number, IimageInterface[]>>({});
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  useEffect(() => {
      const fetchAllImages = async (restaurants: IRestaurantFrontEnd[]) => {
        const imagesMap: Record<number, IimageInterface[]> = {};
        for (const resto of restaurants) {
          if (resto.picturesId && resto.picturesId.length > 0) {
            try {
              imagesMap[resto.uid] = await getImages(resto.picturesId);
            } catch {
              imagesMap[resto.uid] = [{ base64: defaultRestoImage, 
                                        contentType: "image/png", 
                                        filename: "placeholderResto.png",
                                        size: 0,
                                        uploadDate: "0",
                                        id: 0 }];
            }
          } else {
            imagesMap[resto.uid] = [{ base64: defaultRestoImage, 
                                      contentType: "image/png", 
                                      filename: "placeholderResto.png",
                                      size: 0,
                                      uploadDate: "0",
                                      id: 0 }];
          }
        }
        setRestaurantImages(imagesMap);
        setIsImagesLoaded(true);
      };
  
      if (favoriteRestaurants && favoriteRestaurants.length > 0) {
        setIsImagesLoaded(false);
        fetchAllImages(favoriteRestaurants);
      }
    }, [favoriteRestaurants]);

  useEffect(() => {
    fetchProfileData();
    fetchFavoriteRestaurants();
    fetchUserReview();
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
    let paymentMehtods = await getPaymentMethods(userToken);
    if (paymentMehtods && paymentMehtods !== '' && paymentMehtods.length !== 0) {
      setPaymentIsSet(true);
    }
  };

  const fetchFavoriteRestaurants = async () => {
    setLoading(true);
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const favorites = await getRestoFavourites(userToken);
    setFavoriteRestaurants(favorites);
    setLoading(false);
  };

  const fetchFavoriteDishes = async () => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const favorites = await getDishFavourites(userToken);

    const groupedFavs = favorites.reduce((acc: any, favs: any) => {
      const { restoID, restoName, dish } = favs;
      if (!acc[restoID]) {
        acc[restoID] = { restoName, dishes: [] };
      }
      acc[restoID].dishes.push(dish);
      return acc;
    }, {});

    setFavoriteDishes(groupedFavs);
  };
  const fetchUserReview = async () => {
    const userToken = localStorage.getItem("user");
    const userName = localStorage.getItem("userName");
    if (userToken === null) {
      return;
    }
    const review = await getRatingDataUser(userName);
    setUserReview(review);
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
    setIngredientFeedback('');
    try {
      const result = await addIngredient(newIngredient);
      if (result.ok) {
        setDBIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
        setNewIngredient('');
        handleAddIngredientPopupClose();
        setIngredientFeedback(`Successfully added ingredient: ${newIngredient}`);
      } else {
        setNewIngredient('');
        handleAddIngredientPopupClose();
        setIngredientFeedback(`Error handling ingredient change: ${newIngredient}`);
      }
    } catch (error) {
      setNewIngredient('');
      handleAddIngredientPopupClose();
      console.error("Error handling ingredient change:", error);
      setIngredientFeedback(`Error: ${error.message}`);
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
    setSaveFailureType(null);
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
    deleteAccount(userToken).then(res => {
      if (res !== null) {
        const event = new Event('loggedOut');
        localStorage.removeItem('user');
        localStorage.removeItem('visitedBefore');
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
    setDarkMode(!darkMode);
    
    if (!darkMode) {
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
                  deleteProfileImageDB(picture, userToken);                }
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

  const handleDeleteReview = async (userId: string, restoName: string) => {
    await deleteRatingDataUser(userId, restoName);
    setopenReviewPopUp(true);
    fetchUserReview(); 
  };

  useEffect(() => {
    fetchUserReview();
  }, []);

  const handleClosePopUp = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setopenReviewPopUp(false);
  };

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

  const handleRestoClick = (restoId: string) => {
    navigate('/menu/' + restoId);
  };

  const removeFavDish = (dishId: number, restoId: number) => {
    setFavoriteDishes((prevFavorites) => {
      const updatedFavorites = { ...prevFavorites };

      if (updatedFavorites[restoId]) {
        updatedFavorites[restoId].dishes = updatedFavorites[restoId].dishes.filter(
          (dish: any) => dish.uid !== dishId
        );

        if (updatedFavorites[restoId].dishes.length === 0) {
          delete updatedFavorites[restoId];
        }
      }

      return updatedFavorites;
    });
  }

  const removeFavResto = (restoId: number) => {
    const newFavs = favoriteRestaurants?.filter((resto) => resto.uid != restoId);
    setFavoriteRestaurants(newFavs);
  }

  return (
    <div className={styles.MyAccountPage}>
      <Snackbar open={openReviewPopUp} autoHideDuration={5000} onClose={handleClosePopUp}>
        <Alert
          onClose={handleClosePopUp}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {t('pages.MyAccountPage.review-delete-success')}
        </Alert>
      </Snackbar>
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
              allAllergens.map((allergen) => (
              <MenuItem key={allergen} value={allergen} selected={selectedOptions.includes(allergen)}>
                {t('food-allergene.' + allergen)}
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
          className={styles.DropDownAllergens}
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
          {ingredientFeedback && (
            <Typography variant='body2' color='textSecondary'>
              {ingredientFeedback}
            </Typography>
          )}
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
          {paymentIsSet ? (
            <button onClick={() => { navigate('/subscriptions'); }}>
              {t('pages.MyAccountPage.subscriptions')}
            </button>
          ) : (
            <div></div>
          )}
          <button onClick={() => { navigate('/payment'); }}>
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
          <Button onClick={() => { navigate('/feature-request'); }}>
            {t('pages.MyAccountPage.just-ask')}
          </Button>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-10px' }}>
          <Button onClick={() => { navigate('/support'); }}>
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
          <button
            className={activeTab === "reviews" ? styles.activeTab : "none"}
            onClick={() => handleTabChange("reviews")}
          >
            {t('pages.MyAccountPage.fav-reviews')}
          </button>
        </div>

        {/* Display Favorite Restaurants or Dishes based on the active tab */}
        <div className={styles.favoriteListContainer}>
          {activeTab === "restaurants" && (
            <div className={styles.favoriteList}>
              {loading ? (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                </Stack>
              ) : (
                !isImagesLoaded ? ( // Check if images are loading
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                </Stack>
              ) : (
                <>
                  {favoriteRestaurants.length === 0 ? (
                    <div>
                      <span>{t('pages.MyAccountPage.no-fav-restos')}</span>
                    </div>
                  ) : (
                    favoriteRestaurants.map((restaurant, index) => (
                      <RestoCard
                        resto={restaurant}
                        dataIndex={index}
                        key={index}
                        isFavourite={true}
                        deleteFavResto={removeFavResto}
                        pictures={restaurantImages[restaurant.uid] || [{
                          base64: defaultRestoImage,
                          contentType: "image/png",
                          filename: "placeholderResto.png",
                          size: 0,
                          uploadDate: "0",
                          id: 0,
                          }]}
                      />
                    ))
                  )}
                </>
              ))}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className={styles.favoriteList}>
              {userReview && userReview.length === 0 ? (
                <div>
                  <span>{t('pages.MyAccountPage.no-fav-reviews')}</span>
                </div>
              ) : userReview?.map((data, key) => (
                <div key={key} className={styles.CardReview}>
                  <h3>{data.restoName}</h3>
                  <span>{new Date(data.date).toLocaleDateString('en-GB')}</span>
                  <div className={styles.NoteContainer}>
                    <span>{data.note}</span>
                    <Rating name="read-only" value={data.note} readOnly />
                  </div>
                  <h3>{t('pages.MyAccountPage.title-reviews')} :</h3>
                  <span>{data.comment}</span>
                    <Button onClick={() => handleDeleteReview(data._id, data.restoName)} sx={{color: "#6d071a"}} variant="outlined" size="small" >
                      <DeleteIcon />
                    </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "dishes" && (
            <div className={styles.favoriteList}>
              {Object.entries(favoriteDishes).length === 0 ? (
                <div>
                  <span>{t('pages.MyAccountPage.no-fav-dishes')}</span>
                </div>
              ) :
                //@ts-ignore
                Object.entries(favoriteDishes).map(([restoId, {restoName, dishes}]) => {
                  return (
                    <ThemeProvider theme={PageBtn()} key={restoId}>
                      <Divider textAlign={"left"} className={styles.divider}>
                        <h2 className={styles.dividerTitle}>
                          {restoName}
                          <IconButton className={styles.dividerIcon} onClick={() => handleRestoClick(restoId)} aria-label="menu">
                            <RestaurantMenuIcon color="primary" />
                          </IconButton>
                        </h2>

                      </Divider>
                      {dishes.map((dish: any) => {
                        return (
                          <Dish
                            key={dish.uid}
                            dishName={dish.name}
                            dishAllergens={dish.allergens}
                            dishDescription={dish.description}
                            options={dish.options}
                            picturesId={dish.picturesId}
                            price={dish.price}
                            restoID={Number(restoId)}
                            dishID={dish.uid}
                            discount={dish.discount}
                            validTill={dish.validTill}
                            combo={dish.combo}
                            isTopLevel={true}
                            isFavourite={true}
                            deleteFavDish={removeFavDish}
                          />
                        )
                      })}
                    </ThemeProvider>
                  )
                })
              }
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
