import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./Header.module.scss";
import logo from "@src/assets/logo.png";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [routeLoggedIn, setRouteLoggedIn] = useState('/login');
  const navigate = useNavigate();
  
  function logoutUser() {
    localStorage.removeItem('user');
    setLoggedIn(false);
    NavigateTo('/', navigate, {})
  }

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData !== null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      localStorage.removeItem('user');
    }
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
      <span className={styles.NavTitle} onClick={() => NavigateTo('/intropage', navigate, {})}>Welcome to Guardos</span>
    </div>
  );
};

export default Header;