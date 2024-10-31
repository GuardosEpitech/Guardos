import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginDenied.module.scss';
import {useTranslation} from "react-i18next";

const LoginDenied: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('user', token);
      navigate('/');
    }
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
    window.location.reload();
  };

  return (
      <div className={styles.loginDeniedContainer}>
        <h1 className={styles.title}>{t('pages.LoginPage.denied')}</h1>
        <p className={styles.message}>
          {t('pages.LoginPage.error3party')}
        </p>
        <button className={styles.backButton} onClick={handleGoToLogin}>
          {t('pages.ResetPassword.back-to-login')}
        </button>
      </div>
  );
};

export default LoginDenied;
