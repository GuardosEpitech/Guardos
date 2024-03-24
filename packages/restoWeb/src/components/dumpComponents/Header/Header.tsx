import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logo from "@src/assets/logo.png";
import { NavigateTo } from "@src/utils/NavigateTo";
import { checkIfTokenIsValid } from '../../../services/userCalls';
import styles from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogInSite, setIsLogInSite] = useState(false);

  const usePathPattern = useLocation();

  function logoutUser() {
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    setIsLogInSite(false);
    setLoggedIn(false);
    document.dispatchEvent(event);
    NavigateTo('/login', navigate);
  }

  const checkUserToken = async () => {
    try {
      const userToken = localStorage.getItem('user');

      if (userToken === null) {
        setLoggedIn(false);
        return;
      }
      const isUserTokenValid = await checkIfTokenIsValid({ key: userToken });
      if (isUserTokenValid) {
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
    if (usePathPattern.pathname === "/login") {
      setIsLogInSite(true);
    }
    checkUserToken();
  }, [navigate]);

  return (
    <div className={loggedIn ? styles.BackgroundRectLoggedIn
      : styles.BackgroundRectLoggedOut}>
      <span className={loggedIn ? styles.NavTitle : styles.NavTitleLogIn}>
        { loggedIn && (
          <a onClick={logoutUser}>
            Logout
          </a>
        )}
        { !loggedIn && !isLogInSite && (
          <a onClick={() => {
            setIsLogInSite(true);
          }}
          className={styles.NavTitleLogIn}
          href="/login"
          >
            Login
          </a>
        )}
        { !loggedIn && isLogInSite && (
          <a onClick={() => {
            setIsLogInSite(false);
            NavigateTo('/', navigate, {});
          }}>
            Home
          </a>
        )}
      </span>
      { loggedIn 
        &&
        <a
          className={styles.NavTitle}
          href="/account"
        >
          My Account
        </a>
      }
      { loggedIn 
        &&
        <a
          className={styles.NavTitle}
          href="/"
        >
          My Restaurants
        </a>
      }
      <img className={styles.LogoImg} src={logo} alt="Logo" />
      { !loggedIn 
        &&
        <div
          className={styles.NavTitle}
        >
        </div>
      }
      { loggedIn 
        &&
        <a
          className={styles.NavTitle}
          href="/dishes"
        >
          My Dishes
        </a>
      }
      { loggedIn 
        &&
        <a
          className={styles.NavTitle}
          href="/products"
        >
          My Products
        </a>
      }
    </div>
  );
};

export default Header;
