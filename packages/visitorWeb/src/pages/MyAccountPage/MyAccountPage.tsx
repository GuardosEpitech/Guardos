import React, { useState, ChangeEvent } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import styles from "./MyAccountPage.module.scss";
import Style from "ol/style/Style";

const MyAccountPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [allergens, setAllergens] = useState([]);
  const [picture, setPicture] = useState('');
  const [watchedRestaurants, setWatchedRestaurants] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
    </div>
  );
};

export default MyAccountPage;
