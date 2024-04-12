import React, {useEffect, useState} from "react";
import styles from './PaymentFailedContainer.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";


const PaymentFailedPage = () => {
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
      <div className={styles.paymentFailedContainer}>
        <h2>{t('pages.Payments.payment-failed')}</h2>
        <p>
          {t('pages.Payments.payment-failed-text-1')}
        </p>
        <p>{t('pages.Payments.payment-failed-text-2')}</p>
        <a href="/payment" className={styles.tryAgainLink}>
          {t('pages.Payments.try-again')}
        </a>
      </div>
  );
};

export default PaymentFailedPage;
