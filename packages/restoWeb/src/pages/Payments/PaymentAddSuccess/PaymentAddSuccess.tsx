import React from 'react';
import styles from './PaymentAddSuccess.module.scss';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";

const PaymentAddSuccessPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

  const redirectToPaymentPage = () => {
    NavigateTo('/payment', navigate, {})
  };

  return (
    <div className={styles.PaymentSuccessPage}>
      <h1 className={styles.heading}>{t('pages.PaymentAdd.title')}</h1>
      <div className={styles.backButton}>
        <button onClick={redirectToPaymentPage}>{t('pages.PaymentAdd.back')}</button>
      </div>
    </div>
  );
};

export default PaymentAddSuccessPage;
