import React, {useEffect, useState} from "react";
import styles from './ResetPassword.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { 
    checkIfVisitorUserExist, sendRecoveryLinkForVisitorUser
} from '@src/services/userCalls';
import { enable, disable, setFetchMethod} from "darkreader";

import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [openFailed, setOpenFailed] = useState(true);
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

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
            const response = await checkIfVisitorUserExist({ email, username });
            if (response) {
              setDisableButton(true);
              const emailWasSend = await sendRecoveryLinkForVisitorUser({ email, username });
              
              if (emailWasSend) {
                setStep(3);
                setDisableButton(true);
              } else {
                setStep(4);
              }
            } else {
              setError(t('pages.ResetPassword.invalid-credentials', {email: email}));
            }
          } catch (error) {
            console.error('Error checking resto user:', error);
            setError(t('pages.ResetPassword.user-error'));
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

  const handleGoBackToLogin = () => {
    setOpen(false);
    window.location.href = '/login';
  };

  const handleGoBackToSite = () => {
    setOpenFailed(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>{t('pages.ResetPassword.get-back-in-account')}</h1>
      <p className={styles.p}>{step === 1 ? t('pages.ResetPassword.enter-account-info') :
        t('pages.ResetPassword.enter-username-prompt')}</p>
      {step === 1 ? (
        <>
          <div className={styles.labelContainer}>
            <label htmlFor="emailInput">{t('pages.ResetPassword.enter-email')}</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="emailInput"
              type="text"
              placeholder={t('pages.ResetPassword.email')}
              value={email}
              onChange={handleInputChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.emailSection}>
            <label>{t('pages.ResetPassword.email')}: </label>
            <div className={styles.emailDisplay}>
              <span>{email}</span>
              <span className={styles.pencilIcon} onClick={handleGoBack}>
                ✏️
              </span>
            </div>
          </div>
          <div className={styles.labelContainer}>
            <label htmlFor="usernameInput">{t('pages.ResetPassword.enter-username')}</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="usernameInput"
              type="text"
              placeholder={t('pages.ResetPassword.username')}
              value={username}
              onChange={handleInputChange}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </>
      )}
      {step === 3 ? (
        <div>
          <Dialog open={open} onClose={handleGoBackToLogin}>
            <DialogTitle>{t('pages.ResetPassword.email-sent-success')}</DialogTitle>
            <DialogContent>
              <p>{t('pages.ResetPassword.email-sent-failure')}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGoBackToLogin}>{t('pages.ResetPassword.back-to-login')}</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div>

        </div>
      )}
      {step === 4 ? (
        <div>
          <Dialog open={openFailed} onClose={handleGoBackToSite}>
            <DialogTitle>{t('pages.ResetPassword.error')}</DialogTitle>
            <DialogContent>
              <p>{t('pages.ResetPassword.retry-recovery-link')}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGoBackToLogin}>{t('pages.ResetPassword.back-to-login')}</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div>

        </div>
      )}
      {disableButton === true ? (
        <div className={styles.buttonsContainer}>
          <button
              onClick={handleContinue}
              disabled={true}
              className={styles.disableButton}
          >
            {t('pages.ResetPassword.send-recovery-link')}
          </button>
        </div>
      ) : (
        <div className={styles.buttonsContainer}>
          <button
              onClick={handleContinue}
              disabled={step === 1 ? 
                  !isValidEmail(email) : username.trim() === ''}
                  className={step === 1 ? isValidEmail(email) ?
                    styles.buttonEnabled : styles.disableButton :
                    username.trim() !== '' ?
                      styles.buttonEnabled : styles.disableButton}
          >
              {step === 1 ? t('pages.ResetPassword.continue') :
                t('pages.ResetPassword.send-recovery-link')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
