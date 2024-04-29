import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Layout from "shared/components/Layout/Layout";
import axios from 'axios';
import styles from "@src/pages/RegistrationPage/RegistrationPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

interface User {
  username: string;
  email: string;
  password: string;
}

const initialUserState = {
  username: '',
  email: '',
  password: '',
};

const Register = () => {
  const [user, setUser] = useState<User>(initialUserState);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const navigate = useNavigate();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/register`;
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  function isValidPassword(password: string): boolean {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
  
    return (
      password.length >= 7 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password)
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle registration logic here
    try {
      const dataStorage = JSON.stringify({
        username: user.username,
        password: user.password,
        email: user.email
      });

      const validPassword = !isValidPassword(user.password);

      if (validPassword) {
        setErrorPassword(true);
      } else {
        setErrorPassword(false);
      }
      if (!user.email) {
        setErrorEmail(true);
      } else {
        setErrorEmail(false);
      }
      if (!user.username) {
        setErrorUsername(true);
      } else {
        setErrorUsername(false);
      }

      if (errorEmail || validPassword || errorUsername) {
        return;
      }

      const response = await axios({
          method: 'POST',
          url: baseUrl,
          data: dataStorage,
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.data[0]) {
        setErrorEmail(true);
      } else {
        setErrorEmail(false);
      }
      if (response.data[1]) {
        setErrorUsername(true);
      } else {
        setErrorUsername(false);
      }

      if (!response.data.includes(true)) {
        NavigateTo("/login", navigate, {});
      }
      return response.data;
    } catch (error) {
        console.error(`Error in post Route: ${error}`);
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
        <div className={styles.registerForm}>
          <h2>{t('pages.RegistrationPage.register')}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label={t('pages.RegistrationPage.username')}
              name="username"
              value={user.username}
              onChange={handleChange}
              margin="normal"
              error={errorUsername}
              helperText={errorUsername ? t('pages.RegistrationPage.username-exists-or-invalid') : ''}
            />
            <TextField
              label={t('pages.RegistrationPage.email')}
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              margin="normal"
              error={errorEmail}
              helperText={errorEmail ? t('pages.RegistrationPage.email-taken-or-invalid') : ''}
            />
            <TextField
              label={t('pages.RegistrationPage.password')}
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              margin="normal"
              error={errorPassword}
              helperText={errorPassword ? t('pages.RegistrationPage.wrong-pw-format') : ''}
            />
            <Button size='large' type="submit" variant="contained" color="primary">
              {t('pages.RegistrationPage.register')}
            </Button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Register;
