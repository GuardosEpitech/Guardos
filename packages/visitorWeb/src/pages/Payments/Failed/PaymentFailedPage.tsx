import React from 'react';
import styles from './PaymentFailedContainer.module.scss';
import {useTranslation} from "react-i18next";

const PaymentFailedPage = () => {
  const {t} = useTranslation();

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
