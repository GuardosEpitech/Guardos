import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import TextField from "@mui/material/TextField";
import { Container, Divider } from '@mui/material';
import Button from "@mui/material/Button";
import Layout from "shared/components/Layout/Layout";
import axios from 'axios';
import styles from "@src/pages/LoginPage/LoginPage.module.scss";
import { enable, disable, setFetchMethod } from "darkreader";
import VerificationCodeInput
  from "../../components/TwoFactorAuth/TwoFactorAuthentification";
import { useTranslation } from "react-i18next";
import { checkDarkMode } from "../../utils/DarkMode";
import {verfyTwoFactorAndLogin} from "@src/services/userCalls";

interface LoginUser {
  username: string;
  password: string;
  id?: number;
}

const initialUserState = {
  username: '',
  password: '',
};

interface LoginPageProps {
  toggleCookieBanner: (value: boolean) => void;
}

const Login = (props: LoginPageProps) => {
  const [user, setUser] = useState<LoginUser>(initialUserState);
  const [errorForm, setErrorForm] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/restoWeb`;
  const { t } = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataStorage = JSON.stringify({
        username: user.username,
        password: user.password
      });
      const response = await axios({
        method: 'POST',
        url: baseUrl,
        data: dataStorage,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data === 'Invalid Access') {
        setErrorForm(true);
        localStorage.removeItem('user');
      } else {
        if (response.data.twoFactor !== undefined) {
          setShowTwoFactor(true);
          setUser((prevState) => ({ ...prevState, id: response.data.userId }));
        } else {
          localStorage.setItem('user', response.data);
          setErrorForm(false);
          props.toggleCookieBanner(false);
          NavigateTo("/", navigate, {
            loginName: user.username
          });
        }
      }
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
      throw error;
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    try {
      const response = await verfyTwoFactorAndLogin(user.id, code, user);
      console.log(response);
      if (response && response.status === 200) {
        localStorage.setItem('user', response.data);
        props.toggleCookieBanner(false);
        NavigateTo("/", navigate, {
          loginName: user.username
        });
      } else {
        setVerificationError(t('pages.LoginPage.incorrect-code'));
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setVerificationError(t('pages.LoginPage.code-error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      {/* <Layout> */}
        <div className={styles.loginForm}>
          <h2>{t('pages.LoginPage.login')}</h2>
          {!showTwoFactor ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label={t('pages.LoginPage.username-or-email')}
                name="username"
                value={user.username}
                onChange={handleChange}
                margin="normal"
                error={errorForm}
                helperText={errorForm ? t('pages.LoginPage.invalid-credentials') : ''}
              />
              <TextField
                label={t('pages.LoginPage.password')}
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                margin="normal"
                error={errorForm}
                helperText={errorForm ? t('pages.LoginPage.invalid-credentials') : ''}
              />
              <Button type="submit" variant="contained" color="primary" size='large'>
                {t('pages.LoginPage.login')}
              </Button>
              <p className={styles.registerInfo}>
                <a className={styles.registerLink} href="/account-recovery">{t('pages.LoginPage.trouble-logging-in')}</a>
              </p>
              <p className={styles.registerInfo}>
                {t('pages.LoginPage.register-if-no-account')}
                <a className={styles.registerLink} href="/register">
                  {t('pages.LoginPage.here')}
                </a>.
              </p>
            </form>
          ) : (
            <VerificationCodeInput
              onSubmit={handleTwoFactorSubmit}
              errorMessage={verificationError}
            />
          )}
        </div>
      {/* </Layout> */}
    </>
  );
};

export default Login;
