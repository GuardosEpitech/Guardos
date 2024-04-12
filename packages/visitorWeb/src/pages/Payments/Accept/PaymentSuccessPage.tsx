import React, {useEffect, useState} from "react";
import styles from './PaymentSuccessPage.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";


const PaymentSuccessPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  const checkDarkMode = () => {
    if ((localStorage.getItem('darkMode')) == 'true'){
    setFetchMethod((url) => {
      return fetch(url, {
        mode: 'no-cors',
      });
    });
    enable({
      brightness: 100,
      contrast: 100,
      darkSchemeBackgroundColor: '#181a1b',
      darkSchemeTextColor: '#e8e6e3'
    },);
    } else {
      disable();
    }
  }

  return (
      <div className={styles.paymentSuccessContainer}>
        <h2>{t('pages.Payments.payment-success')}</h2>
        <p>{t('pages.Payments.payment-success-text-1')}</p>
        <p>{t('pages.Payments.payment-success-text-2')}</p>
        <a href="/" className={styles.homeLink}>{t('pages.Payments.return-home')}</a>
      </div>
  );
};

export default PaymentSuccessPage;
