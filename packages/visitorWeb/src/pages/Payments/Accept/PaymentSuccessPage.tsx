import React, {useEffect, useState} from "react";
import styles from './PaymentSuccessPage.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";

const PaymentSuccessPage = () => {
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
        <h2>Payment Successful</h2>
        <p>Thank you for your payment. Your transaction has been completed, and a receipt for your purchase has been emailed to you. You may check your mails to view details of this transaction.</p>
        <p>For any further assistance, please contact our customer support.</p>
        <a href="/" className={styles.homeLink}>Return to Home</a>
      </div>
  );
};

export default PaymentSuccessPage;
