import React from 'react';
import styles from './PaymentSuccessPage.module.scss';
import {useTranslation} from "react-i18next";

const PaymentSuccessPage = () => {
  const {t} = useTranslation();

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
