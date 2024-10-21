import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import { Container, Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Layout from 'shared/components/Layout/Layout';
import FacebookLogo from '../../assets/Facebook.png';
import GoogleLogo from '../../assets/Google.svg';
import axios from 'axios';
import styles from "@src/pages/LoginPage/LoginPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/google/callback`;
const SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';



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
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/`;
  const verifyLink = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/register/resend-verification`;
  const {t} = useTranslation();
  const [isUnverified, setIsUnverified] = useState(false);

  useEffect(() => {
    checkDarkMode();
  }, []);

  const handleFacebookLogin = () => {
    const clientId = process.env.FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent(`${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/facebook/callback`);
    const scope = encodeURIComponent('email,public_profile');
    const authUrl =
        `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&auth_type=rerequest`;

    window.location.href = authUrl;
  };

  const handleGoogleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const dataStorage = JSON.stringify({
        username: user.username,
        password: user.password,
      });
  
      const response = await axios({
        method: 'POST',
        url: baseUrl,
        data: dataStorage,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        setIsUnverified(false);
        localStorage.setItem('user', response.data);
        localStorage.setItem('userName', user.username);
        setErrorForm(false);
        props.toggleCookieBanner(false);
        NavigateTo("/", navigate, {
          loginName: user.username,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 403) {
            setErrorForm(true);
            localStorage.removeItem('user');
          }
          if (error.response.status === 404) {
            localStorage.removeItem('user');
            setIsUnverified(true);
          }
        } else {
          console.error(`Error with request: ${error.message}`);
        }
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleKeyDownGoogle = (event:any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleGoogleLogin();
      // Prevent default action if the key was a space to avoid scrolling
      event.preventDefault();
    }
  };

  const handleKeyDownFacebook = (event:any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleFacebookLogin();
      // Prevent default action if the key was a space to avoid scrolling
      event.preventDefault();
    }
  };

  const resendValidationLink = async () => {
    const email = user.username;
    try {
      const response = await axios.post(verifyLink, { email });
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error with request: ${error.message}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  };

  return (
    <>
      {/* <Layout> */}
        <div className={styles.loginForm}>
          <h2>{t('pages.LoginPage.login')}</h2>
          {isUnverified && (
            <div>
              <h3 className={styles.errorTxt}>{t('pages.LoginPage.unverified')}</h3>
              <button className={styles.resendButton} onClick={resendValidationLink}>
                {t('pages.VerifyEmailPage.resend')}
              </button>
            </div>
          )}
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
              <a className={styles.registerLink} href="/account-recovery">
                {t('pages.LoginPage.trouble-logging-in')}
              </a>.
            </p>
            <p className={styles.registerInfo}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {t('pages.LoginPage.register-if-no-account')} <a className={styles.registerLink} href="/register">
              {t('pages.LoginPage.here')}
            </a>.
            </p>
            <Container sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
              <span>{t('pages.LoginPage.or')}</span>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
            </Container>
            <Container maxWidth="xs" sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '25px',
              justifyContent: 'space-around'
            }}>
              <img
                  src={FacebookLogo}
                  alt={t('pages.LoginPage.facebook-img-alt')}
                  style={{width: '50px', height: '50px', cursor: 'pointer'}}
                  onClick={handleFacebookLogin}
                  onKeyDown={handleKeyDownFacebook}
                  tabIndex={0}
                  aria-label='facebook logo'
                  title='facebook logo'
              />
              <div className={styles.dividerLogos}></div>

              <img
                src={GoogleLogo}
                alt={t('pages.LoginPage.google-img-alt')}
                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                onClick={handleGoogleLogin}
                onKeyDown={handleKeyDownGoogle}
                tabIndex={0}
                aria-label='google logo'
                title='google logo'
                role='button'
              />
            </Container>
          </form>
        </div>
      {/* </Layout> */}
    </>
  );
};

export default Login;
