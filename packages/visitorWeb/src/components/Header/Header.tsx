import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./Header.module.scss";
import {checkIfVisitorTokenIsValid} from "restoweb/src/services/userCalls";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [routeLoggedIn, setRouteLoggedIn] = useState('/login');
  const navigate = useNavigate();
  
  function logoutUser() {
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    setLoggedIn(false);
    document.dispatchEvent(event);
    NavigateTo('/', navigate, {})
  }

  const checkUserToken = async () => {
    try {
      const userToken = localStorage.getItem('user');

      if (userToken === null) {
        setLoggedIn(false);
        return;
      }
      const isUserTokenValid = await checkIfVisitorTokenIsValid({ key: userToken });

      if (isUserTokenValid === 'OK') {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, []);

  return (
    <div className={styles.BackgroundRect}>
      <span className={styles.NavTitle}>
        { loggedIn ? (
          <a onClick={logoutUser}>
            Logout
          </a>
        ) : (
          <a onClick={() => NavigateTo('/login', navigate, {})}>
            Login
          </a>
        )}
      </span>
      { loggedIn && (
          <span className={styles.NavTitle} onClick={() => NavigateTo('/my-account', navigate, {})}>My Account</span>
        )
      }
      <div className={styles.logoContainer} onClick={() => NavigateTo('/', navigate, {})}>
        <div className={styles.logo}></div>
      </div>
      <span className={styles.NavTitle} onClick={() => NavigateTo('/about-us', navigate, {})}>About Us ?</span>
      <span className={styles.NavTitle} onClick={() => NavigateTo('/contact', navigate, {})}>Contact Us</span>
    </div>
  );
};

export default Header;
