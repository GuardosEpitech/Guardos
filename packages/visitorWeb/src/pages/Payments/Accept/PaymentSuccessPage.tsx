import React from 'react';
import styles from './PaymentSuccessPage.module.scss';

const PaymentSuccessPage = () => {
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
