import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import TextField from "@mui/material/TextField";
import { Container, Divider } from '@mui/material';
import Button from "@mui/material/Button";
import FacebookLogo from '../../assets/Facebook.png';
import GoogleLogo from '../../assets/Google.svg';
import Layout from "shared/components/Layout/Layout";
import axios from 'axios';
import styles from "@src/pages/LoginPage/LoginPage.module.scss";
import {useTranslation} from "react-i18next";

interface LoginUser {
  username: string;
  password: string;
}

const initialUserState = {
  username: '',
  password: '',
};

const Login = () => {
  const [user, setUser] = useState<LoginUser>(initialUserState);
  const [errorForm, setErrorForm] = useState(false);
  const navigate = useNavigate();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/restoWeb`;
  const {t} = useTranslation();

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    alert('Redirecting to Facebook login');
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    alert('Redirecting to Google login');
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
        NavigateTo("/", navigate, {
          loginName: user.username
        })
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
          <h2>{t('pages.Router.login')}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username or Email"
              name="username"
              value={user.username}
              onChange={handleChange}
              margin="normal"
              error={errorForm}
              helperText={errorForm ? 'Invalid Logindata' : ''}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              margin="normal"
              error={errorForm}
              helperText={errorForm ? 'Invalid Logindata' : ''}
            />
            <Button type="submit" variant="contained" color="primary" size='large'>
              Login
            </Button>
            <p className={styles.registerInfo}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <a className={styles.registerLink} href="/account-recovery">Trouble logging in?</a>.
            </p>
            <p className={styles.registerInfo}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't you have an account yet? Register yourself <a className={styles.registerLink} href="/register">here</a>.
            </p>
            <Container sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
              <span>Or</span>
              <Divider sx={{ width: '40%', marginY: '20px' }} />
            </Container>
            <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '25px', justifyContent: 'space-around' }}>
              <img
                src={FacebookLogo}
                alt="Facebook Logo"
                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                onClick={handleFacebookLogin}
              />
              <div className={styles.dividerLogos}></div>
              <img
                src={GoogleLogo}
                alt="Google Logo"
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
