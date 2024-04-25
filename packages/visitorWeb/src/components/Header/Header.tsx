import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NavigateTo } from "@src/utils/NavigateTo";
import TranslateIcon from "@mui/icons-material/Translate";

import styles from "./Header.module.scss";
import {checkIfVisitorTokenIsValid} from "@src/services/userCalls";
import {useTranslation} from "react-i18next";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [routeLoggedIn, setRouteLoggedIn] = useState('/login');
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageDropdown(false);
  };
  
  function logoutUser() {
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    setLoggedIn(false);
    document.dispatchEvent(event);
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
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, [navigate]);

  return (
    <div className={styles.containerHeader}>
      <div className={styles.header}>
        <div className={styles.logoContainer} onClick={() => NavigateTo('/', navigate, {})}>
          <div className={styles.logo}></div>
        </div>
        <div className={styles.headerLinks}>
          <span className={styles.NavTitle}>
            { loggedIn ? (
              <a onClick={logoutUser}>
                {t('components.Header.logout')}
              </a>
            ) : (
              <a onClick={() => NavigateTo('/login', navigate, {})}>
                {t('components.Header.login')}
              </a>
            )}
          </span>
          { loggedIn && (
              <span className={styles.NavTitle} onClick={() => NavigateTo('/my-account', navigate, {})}>{t('components.Header.my-account')}</span>
            )
          }
          <span className={styles.NavTitle} onClick={() => NavigateTo('/intropage', navigate, {})}>{t('components.Header.welcome')}</span>
          <a
            className={styles.NavTitle}
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown);
            }}
          >
            <TranslateIcon fontSize="medium" />
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
    </div>
  );
};

export default Header;
