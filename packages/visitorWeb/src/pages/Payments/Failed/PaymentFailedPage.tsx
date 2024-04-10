import React, {useEffect, useState} from "react";
import styles from './PaymentFailedContainer.module.scss';
import { enable, disable, setFetchMethod} from "darkreader";

const PaymentFailedPage = () => {

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
        <h2>Payment Failed</h2>
        <p>pull
          We're sorry, but your transaction could not be completed at this time. There may have been an issue with your payment method or the transaction was declined.</p>
        <p>Please try again or contact us for assistance.</p>
        <a href="/payment" className={styles.tryAgainLink}>Try Again</a>
      </div>
  );
};

export default PaymentFailedPage;
