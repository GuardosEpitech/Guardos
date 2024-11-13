import React, {useEffect, useState} from "react";
import styles from './PaymentFailedContainer.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";

const PaymentFailedPage = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
      <div className={styles.paymentFailedContainer}>
        <h2>{t('pages.Payments.payment-failed')}</h2>
        <p>
          {t('pages.Payments.payment-failed-text-1')}
        </p>
        <p>{t('pages.Payments.payment-failed-text-2')}</p>
        <a onClick={() => { navigate('/payment'); }} className={styles.tryAgainLink}>
          {t('pages.Payments.try-again')}
        </a>
      </div>
  );
};

export default PaymentFailedPage;
