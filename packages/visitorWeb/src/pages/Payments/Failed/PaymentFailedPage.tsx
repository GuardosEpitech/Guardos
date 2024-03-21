import React from 'react';
import styles from './PaymentFailedContainer.module.scss';

const PaymentFailedPage = () => {
  return (
      <div className={styles.paymentFailedContainer}>
        <h2>Payment Failed</h2>
        <p>We're sorry, but your transaction could not be completed at this time. There may have been an issue with your payment method or the transaction was declined.</p>
        <p>Please try again or contact us for assistance.</p>
        <a href="/payment" className={styles.tryAgainLink}>Try Again</a>
      </div>
  );
};

export default PaymentFailedPage;
