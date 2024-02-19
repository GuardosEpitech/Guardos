import React, { useState } from 'react';
import styles from './ResetPassword.module.scss';
import { 
    checkIfRestoUserExist 
} from '@src/services/userCalls';

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (isValidEmail(email)) {
        setStep(2);
        setError('');
      }
    } else if (step === 2) {
      if (username.trim() !== '') {
        try {
            const response = await checkIfRestoUserExist({ email, username });
            if (response) {
              window.location.href = '/login';
            } else {
              setError(`That username and email (${email}) don't match. Please check its spelling or try another username.`);
            }
          } catch (error) {
            console.error('Error checking resto user:', error);
            setError('Error checking resto user. Please try again.');
          }
      }
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (step === 1) {
      setEmail(e.target.value);
    } else if (step === 2) {
      setUsername(e.target.value);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Getting back into your Guardos account</h1>
      <p>{step === 1 ? 'Tell us some information about your account' : 
      'Next, give us the Guardos username you\'re having trouble with'}</p>
      {step === 1 ? (
        <>
          <div className={styles.labelContainer}>
            <label htmlFor="emailInput">Enter your email address</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="emailInput"
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.emailSection}>
            <label>Email</label>
            <div className={styles.emailDisplay}>
              <span>{email}</span>
              <span className={styles.pencilIcon} onClick={handleGoBack}>
                ✏️
              </span>
            </div>
          </div>
          <div className={styles.labelContainer}>
            <label htmlFor="usernameInput">Enter your username</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="usernameInput"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleInputChange}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </>
      )}
      <div className={styles.buttonsContainer}>
        <button
            onClick={handleContinue}
            disabled={step === 1 ? 
                !isValidEmail(email) : username.trim() === ''}
            className={step === 1 ? isValidEmail(email) ? 
                styles.buttonEnabled : '' : username.trim() !== '' ? 
                styles.buttonEnabled : ''}
        >
            {step === 1 ? 'Continue' : 'Send My Password Reset Link'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
