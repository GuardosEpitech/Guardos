import React, {useEffect, useState} from "react";
import styles from './PaymentSuccessPage.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";


const PaymentSuccessPage = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
      <div className={styles.paymentSuccessContainer}>
        <h2>{t('pages.Payments.payment-success')}</h2>
        <p>{t('pages.Payments.payment-success-text-1')}</p>
        <p>{t('pages.Payments.payment-success-text-2')}</p>
        <a onClick={() => { navigate('/'); }} className={styles.homeLink}>{t('pages.Payments.return-home')}</a>
      </div>
  );
};

export default PaymentSuccessPage;
