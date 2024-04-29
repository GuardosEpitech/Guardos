import React, {useEffect, useState} from "react";
import styles from './PaymentSuccessPage.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../../utils/DarkMode";



const PaymentSuccessPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

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
