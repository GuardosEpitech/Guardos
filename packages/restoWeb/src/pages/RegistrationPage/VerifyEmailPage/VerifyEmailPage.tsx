import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '@src/pages/RegistrationPage/VerifyEmailPage/VerifyEmailPage.module.scss';
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";

const EmailVerification: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/register/restoWeb`;

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setMessage('Invalid verification link.');
        setIsSuccess(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/verify-email?token=${token}`);
        setMessage(response.data);
        setIsSuccess(true);
      } catch (error) {
        setMessage('Verification failed. The token may have expired.');
        setIsSuccess(false);
      }
    };

    verifyEmail();
  }, [location]);

  const redirectToLogin = () => {
    NavigateTo("/login", navigate, {});
  };

  const resendValidationLink = async () => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');

    try {
      const response = await axios.post(`${baseUrl}/resend-verification`, { email });
      setMessage('A new verification link has been sent to your email.');
    } catch (error) {
      setMessage('Failed to resend verification link. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('pages.VerifyEmailPage.title')}</h1>
      <p className={styles.message}>{message}</p>

      {isSuccess && (
        <button className={styles.successButton} onClick={redirectToLogin}>
          {t('pages.VerifyEmailPage.login')}
        </button>
      )}

      {isSuccess === false && (
        <button className={styles.resendButton} onClick={resendValidationLink}>
          {t('pages.VerifyEmailPage.resend')}
        </button>
      )}
    </div>
  );
};

export default EmailVerification;
