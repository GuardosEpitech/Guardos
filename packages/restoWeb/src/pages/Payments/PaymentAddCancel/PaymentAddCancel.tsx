import React from 'react';
import styles from './PaymentAddCancel.module.scss';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";

const PaymentAddCancelPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

  const redirectToPaymentPage = () => {
    NavigateTo('/payment', navigate, {})
  };

  return (
    <div className={styles.PaymentFailPage}>
      <h1 className={styles.heading}>{t('pages.PaymentCancel.title')}</h1>
      <div className={styles.backButton}>
        <button onClick={redirectToPaymentPage}>{t('pages.PaymentCancel.back')}</button>
      </div>
    </div>
  );
};

export default PaymentAddCancelPage;
