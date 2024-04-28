import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logo from "@src/assets/logo.png";
import { NavigateTo } from "@src/utils/NavigateTo";
import { checkIfTokenIsValid } from '../../../services/userCalls';
import styles from "./Header.module.scss";
import TranslateIcon from "@mui/icons-material/Translate";
import {useTranslation} from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { t, i18n } = useTranslation();
  const usePathPattern = useLocation();

  function logoutUser() {
    const event = new Event('loggedOut');
    localStorage.removeItem('user');
    localStorage.removeItem('visitedRestoBefore');
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
    checkUserToken();
  }, [navigate]);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageDropdown(false);
  };

  return (
    <div className={styles.containerHeader}>
      <div className={styles.header}>
        <div className={styles.logoContainer} onClick={() => NavigateTo('/', navigate, {})}>
          <div className={styles.logo}></div>
        </div>
        <div className={styles.headerLinks}>
          <span className={styles.NavTitle}>
            { !loggedIn ? (
              <span className={styles.NavTitle} onClick={() => NavigateTo('/login', navigate, {})}>{t('components.Header.login')}</span>
            ) : (
              <></>
            )}
          </span>
          { loggedIn && (
                <span className={styles.NavTitle} onClick={logoutUser}>{t('components.Header.logout')}</span>
            )
          }
          { loggedIn && (
                <span className={styles.NavTitle} onClick={() => NavigateTo('/', navigate, {})}>{t('components.Header.home')}</span>
            )
          }
          { loggedIn && (
                <a className={styles.NavTitle} href='/account'>{t('components.Header.my-account')}</a>
            )
          }
          { loggedIn && (
                <a className={styles.NavTitle} href='/'>{t('common.my-restos')}</a>
            )
          }
          { loggedIn && (
                <a className={styles.NavTitle} href='/dishes'>{t('common.my-dishes')}</a>
            )
          }
          { loggedIn && (
                <a className={styles.NavTitle} href='/products'>{t('common.my-products')}</a>
            )
          }
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
