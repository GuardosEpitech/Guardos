import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logo from "@src/assets/logo.png";
import { NavigateTo } from "@src/utils/NavigateTo";
import { checkIfTokenIsValid } from '../../../services/userCalls';
import styles from "./Header.module.scss";
import { useTranslation } from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const { t } = useTranslation();
  const usePathPattern = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);

  function logoutUser() {
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    localStorage.removeItem('visitedRestoBefore');
    setLoggedIn(false);
    document.dispatchEvent(event);
    handleOptionClick();
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
    checkUserToken();
  }, [navigate]);

  const handleOptionClick = () => {
    setShowDrawer(false);
  };

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
            setShowDrawer(!showDrawer);
          }}
        >
          <MenuIcon fontSize="large" style={{ color: '#6d071a' }} />
        </a>
        <div className={styles.logoContainer} onClick={() => loggedIn ? navigate('/') : null} onKeyDown={handleKeyDown} aria-label='guardos logo' title='guardos logo' tabIndex={0}>
          <div className={styles.logo} role="img"></div>
        </div>
        <div className={styles.headerLinks}>
          {!loggedIn ? (
            <a className={styles.NavTitleDropDown} href="/login">{t('components.Header.login')}</a>
          ) : (
            <>
              <a className={styles.NavTitle} onClick={logoutUser} role='link' tabIndex={0} href="javascript:void(0);">{t('components.Header.logout')}</a>
              <a className={styles.NavTitle} href="/account" onClick={() => { handleOptionClick(); navigate('/account'); }}>{t('components.Header.my-account')}</a>
              <a className={styles.NavTitle} href="/restoOverview" onClick={() => { handleOptionClick(); navigate('/restoOverview'); }}>{t('common.resto-overview')}</a>
              <a className={styles.NavTitle} href="/insights" onClick={() => { handleOptionClick(); navigate('/insights'); }}>{t('common.insights')}</a>
              <a className={styles.NavTitle} href="/guides" onClick={() => { handleOptionClick(); navigate('/guides'); }}>{t('components.Header.guides')}</a>
            </>
          )}
        </div>
      </div>
      <Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)} classes={{ paper: styles.drawer }}>
        <div className={styles.drawerContent}>
          {!loggedIn ? (
            <a className={styles.NavTitleDropDown} href="login">{t('components.Header.login')}</a>
          ) : (
              <>
                <a className={styles.NavTitleDropDown} onClick={logoutUser} role='link' tabIndex={0} href="javascript:void(0);">{t('components.Header.logout')}</a>
                <a className={styles.NavTitleDropDown} href="/account" onClick={() => { handleOptionClick(); navigate('/account'); }}>{t('components.Header.my-account')}</a>
                <a className={styles.NavTitleDropDown} href="/restoOverview" onClick={() => { handleOptionClick(); navigate('/restoOverview'); }}>{t('common.resto-overview')}</a>
                <a className={styles.NavTitleDropDown} href="/insights" onClick={() => { handleOptionClick(); navigate('/insights'); }}>{t('common.insights')}</a>
                <a className={styles.NavTitleDropDown} href="/guides" onClick={() => { handleOptionClick(); navigate('/guides'); }}>{t('components.Header.guides')}</a>
              </>
            )}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
