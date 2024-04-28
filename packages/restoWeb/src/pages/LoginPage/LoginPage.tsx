import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Container, Divider } from '@mui/material';
import Button from "@mui/material/Button";
import FacebookLogo from '../../assets/Facebook.png';
import GoogleLogo from '../../assets/Google.svg';
import Layout from "shared/components/Layout/Layout";
import axios from 'axios';
import styles from "@src/pages/LoginPage/LoginPage.module.scss";
import {useTranslation} from "react-i18next";
import { Navigate } from 'react-router-dom';

interface LoginUser {
  username: string;
  password: string;
}

const initialUserState = {
  username: '',
  password: '',
};

interface LoginPageProps {
  toggleCookieBanner: (value: boolean) => void;
}

const Login = (props:LoginPageProps) => {
  const [user, setUser] = useState<LoginUser>(initialUserState);
  const [errorForm, setErrorForm] = useState(false);
  const navigate = useNavigate();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/restoWeb`;
  const {t} = useTranslation();

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    alert(t('pages.LoginPage.redirect-facebook-login'));
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    alert(t('pages.LoginPage.redirect-google-login'));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle registration logic here
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
        localStorage.setItem('user', response.data);
        setErrorForm(false);
        props.toggleCookieBanner(false);
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <Layout>
        <div className={styles.loginForm}>
          <h2>{t('pages.LoginPage.login')}</h2>
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
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <a className={styles.registerLink} href="/account-recovery">{t('pages.LoginPage.trouble-logging-in')}</a>
            </p>
            <p className={styles.registerInfo}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {t('pages.LoginPage.register-if-no-account')}
              <a className={styles.registerLink} href="/register">
                {t('pages.LoginPage.here')}
              </a>.
            </p>
            <Container sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
              <span>{t('pages.LoginPage.or')}</span>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
            </Container>
            <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '25px', justifyContent: 'space-around' }}>
              <img
                src={FacebookLogo}
                alt={t('pages.LoginPage.facebook-img-alt')}
                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                onClick={handleFacebookLogin}
              />
              <div className={styles.dividerLogos}></div>
              <img
                src={GoogleLogo}
                alt={t('pages.LoginPage.google-img-alt')}
                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                onClick={handleGoogleLogin}
              />
            </Container>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Login;
