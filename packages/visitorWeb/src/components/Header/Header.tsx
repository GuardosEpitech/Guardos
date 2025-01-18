import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';


import styles from "./Header.module.scss";
import { checkIfVisitorTokenIsValid } from "@src/services/userCalls";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [routeLoggedIn, setRouteLoggedIn] = useState('/login');
  const navigate = useNavigate();
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const { t } = useTranslation();

  function logoutUser() {
    handleOptionClick();
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    localStorage.removeItem('visitedBefore');
    setLoggedIn(false);
    document.dispatchEvent(event);
    const userEvent = new CustomEvent("setUserToken");
    window.dispatchEvent(userEvent);
    NavigateTo('/login', navigate, {})
  }

  const checkUserToken = async () => {
    try {
      const userToken = localStorage.getItem('user');

      if (userToken === null) {
        setLoggedIn(false);
        return;
      }
      const isUserTokenValid = await checkIfVisitorTokenIsValid({ key: userToken });

      if (isUserTokenValid) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        localStorage.removeItem('user');
        const userEvent = new CustomEvent("setUserToken");
        window.dispatchEvent(userEvent);
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  const handleOptionClick = () => {
    setShowNavigationDrawer(false);
  };

  useEffect(() => {
    checkUserToken();
  }, [navigate]);

  const handleKeyDown = (event:any) => {
    if ((event.key === 'Enter' || event.key === ' ') && loggedIn) {
      navigate('/');
      // Prevent default action if the key was a space to avoid scrolling
      event.preventDefault();
    }
  };

  return (
    <div className={styles.containerHeader}>
      <div className={styles.header}>
        <a
          className={styles.NavTitleHamburger}
          onClick={() => {
            setShowNavigationDrawer(!showNavigationDrawer);
          }}
        >
          <MenuIcon fontSize="large" style={{ color: '#6D071A' }} />
        </a>
        <div className={styles.logoContainer} onClick={() => loggedIn ? navigate('/') : null} onKeyDown={handleKeyDown} aria-label='guardos logo' title='guardos logo' tabIndex={0}>
          <div className={styles.logo} role="img"></div>
        </div>
        <div className={styles.headerLinks}>
          { loggedIn ? (
            <a className={styles.NavTitle} onClick={logoutUser} role='link' tabIndex={0} href="javascript:void(0);">
              {t('components.Header.logout')}
            </a>
          ) : (
            <a className={styles.NavTitle} onClick={() => NavigateTo('/login', navigate, {})} role='link' tabIndex={0} href="javascript:void(0);">
              {t('components.Header.login')}
            </a>
          )}
          { loggedIn && (
            <>
              <a className={styles.NavTitle} onClick={() => { navigate('/my-account'); }}>{t('components.Header.my-account')}</a>
              <a className={styles.NavTitle} onClick={() => { navigate('/guides'); }}>{t('components.Header.guides')}</a>
            </>
          )}
          <a className={styles.NavTitle} onClick={() => { navigate('/intropage'); }}>{t('components.Header.welcome')}</a>
        </div>
      </div>
      <Drawer anchor="left" open={showNavigationDrawer} onClose={() => setShowNavigationDrawer(false)} classes={{ paper: styles.drawer }}>
        <div className={styles.drawerContent}>
          <span className={styles.NavTitleDropDown}>
            { loggedIn ? (
              <a onClick={logoutUser}>
                {t('components.Header.logout')}
              </a>
            ) : (
              <a onClick={() => {handleOptionClick(); NavigateTo('/login', navigate, {});}}>
                {t('components.Header.login')}
              </a>
            )}
          </span>
          { loggedIn && (
              <>
                <a className={styles.NavTitleDropDown} onClick={() => { navigate('/'); }}>{t('components.Header.home')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { navigate('/my-account'); }}>{t('components.Header.my-account')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { navigate('/guides'); }}>{t('components.Header.guides')}</a>
              </>
            )
          }
          <a className={styles.NavTitleDropDown} onClick={() => { navigate('/intropage'); }}>{t('components.Header.welcome')}</a>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
