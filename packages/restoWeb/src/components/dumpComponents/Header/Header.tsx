import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logo from "@src/assets/logo.png";
import { NavigateTo } from "@src/utils/NavigateTo";
import { checkIfTokenIsValid } from '../../../services/userCalls';
import styles from "./Header.module.scss";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { t, i18n } = useTranslation();
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

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageDropdown(false);
    setShowDrawer(false);
  };

  const handleOptionClick = () => {
    setShowDrawer(false);
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
          <MenuIcon fontSize="large" style={{ color: 'white' }} />
        </a>
        <div className={styles.logoContainer} onClick={() => loggedIn ? navigate('/') : null}>
          <div className={styles.logo}></div>
        </div>
        <div className={styles.headerLinks}>
          {!loggedIn ? (
            <span className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/login'); }}>{t('components.Header.login')}</span>
          ) : (
            <>
              <a className={styles.NavTitle} onClick={logoutUser}>{t('components.Header.logout')}</a>
              <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/account'); }}>{t('components.Header.my-account')}</a>
              <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/'); }}>{t('common.my-restos')}</a>
              <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/addCategory'); }}>{t('common.my-category')}</a>
              <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/dishes'); }}>{t('common.my-dishes')}</a>
              <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/products'); }}>{t('common.my-products')}</a>
            </>
          )}
          <a
            className={styles.NavTitleLanguage}
            id="language"
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown);
            }}
          >
            <TranslateIcon fontSize="medium" className={styles.logo}/>
            {showLanguageDropdown && (
              <div className={styles.languageDropdown}>
                <a className={styles.languageOption} onClick={() => changeLanguage('en')}>
                  {t('common.english')}
                </a>
                <a className={styles.languageOption} onClick={() => changeLanguage('de')}>
                  {t('common.german')}
                </a>
                <a className={styles.languageOption} onClick={() => changeLanguage('fr')}>
                  {t('common.french')}
                </a>
              </div>
            )}
          </a>
        </div>
      </div>
      <Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)} classes={{ paper: styles.drawer }}>
        <div className={styles.drawerContent}>
          {!loggedIn ? (
            <span className={styles.NavTitleDropDown} onClick={() => { handleOptionClick(); navigate('/login'); }}>{t('components.Header.login')}</span>
          ) : (
              <>
                <a className={styles.NavTitleDropDown} onClick={logoutUser}>{t('components.Header.logout')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { handleOptionClick(); navigate('/account'); }}>{t('components.Header.my-account')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { handleOptionClick(); navigate('/'); }}>{t('common.my-restos')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { handleOptionClick(); navigate('/addCategory'); }}>{t('common.my-category')}</a>
                <a className={styles.NavTitle} onClick={() => { handleOptionClick(); navigate('/dishes'); }}>{t('common.my-dishes')}</a>
                <a className={styles.NavTitleDropDown} onClick={() => { handleOptionClick(); navigate('/products'); }}>{t('common.my-products')}</a>
              </>
            )}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
