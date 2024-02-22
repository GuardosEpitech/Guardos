import React, { useState } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import styles from "./MyAccountPage.module.scss";
import {deleteAccount} from "@src/services/userCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [allergens, setAllergens] = useState([]);
  const [picture, setPicture] = useState('');
  const [watchedRestaurants, setWatchedRestaurants] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const navigate = useNavigate();

  const handlePictureChange = (e : any) => {
    setPicture(e.target.value);
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

  const handleAddRestaurant = () => {
    // Add the watched restaurant to the list

    //setWatchedRestaurants((prevRestaurants) => [newRestaurant, ...prevRestaurants]);
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

  return (
    <div className={styles.MyAccountPage}>
      <div className={styles.profileSection}>
        <h1>Account Page</h1>
        <div className={styles.profilePicture}>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handlePictureChange} />
          {/* Add an image preview */}
          {picture && <img src={picture} alt="Profile" className={styles.profileImage} />}
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={handleEmailChange} required/>
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} required/>
        </div>
        <div>
          <label>City:</label>
          <input type="text" value={city} onChange={handleCityChange} />
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
            <MenuItem value="peanut">Peanut</MenuItem>
            <MenuItem value="gluten">Gluten</MenuItem>
            <MenuItem value="dairy">Dairy</MenuItem>
          </Select>
        </FormControl>
        </div>
        <button onClick={handleAddRestaurant}>Apply Change</button>
        <button className={styles.deleteButton} onClick={handleOpenDeletePopup}>Delete Account</button>
      </div>
      <div className={styles.restaurantSection}>
        <h1>Last Watched Restaurants</h1>
        <ul>
          {watchedRestaurants.map((restaurant, index) => (
            <li key={index}>
              <strong>{restaurant.name}</strong> - {restaurant.date}
            </li>
          ))}
        </ul>
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
