import React, { useState, useEffect } from 'react';
import styles from "@src/pages/ChangePassword/ChangePasswordPage.module.scss";
import { useParams, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { 
  checkIfVisitorTokenIsValid, updateVisitorPassword
} from '@src/services/userCalls';
import { set } from 'cypress/types/lodash';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";

const ChangePasswordPage = () => {
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  const email = params.get('email');
  const userToken = params.get('userToken');
  const timeToken = params.get('timeToken');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: email || '',
    newPassword: '',
    repeatPassword: '',
  });
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPasswordRepeat, setErrorPasswordRepeat] = useState(false);
  const [open, setOpen] = useState(true);
  const [openFailed, setOpenFailed] = useState(true);
  const {t} = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (email && userToken && timeToken) {
        setFormData((prevData) => ({ ...prevData, email }));
        
        const tokenValid = await checkIfVisitorTokenIsValid({ key: userToken });
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const isOlderThan15Minutes = (currentTimestamp - Math.floor(Number(timeToken) / 1000)) > 900;
        
        if (!isOlderThan15Minutes && tokenValid !== null) {
          setStep(2);
        } else {
          setStep(1);
        }
      } else {
        setStep(1);
      }
    }

    fetchData();
  }, [email]);

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

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    let errorPasswordTemp = false;
    let errorPasswordRepeatTemp = false;

    if (formData.newPassword !== formData.repeatPassword) {
      setErrorPasswordRepeat(true);
      errorPasswordRepeatTemp = true;
    }
    if (!isValidPassword(formData.newPassword)) {
      setErrorPassword(true);
      errorPasswordTemp = true;
    }

    if (errorPasswordTemp || errorPasswordRepeatTemp) {
      return;
    }

    try {
      const response = await updateVisitorPassword(userToken, formData.newPassword);

      if (response === true) {
        setStep(3);
      } else {
        setStep(4);
      }
    } catch (error) {
      console.error(`Error in post Route: ${error}`);
      throw error;
    }

    console.log('Form submitted:', formData);
  };

  const handleGoBackToLogin = () => {
    setOpen(false);
    navigate('/login');
  };

  const handleGoBackToSite = () => {
    setOpenFailed(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        {step === 1 ? (
          <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
              {t('pages.ChangePassword.invalid-link-redirect-to-mainpage')}
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
              {t('pages.ChangePassword.change-pw')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('pages.ChangePassword.email')}
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!email} // Disable editing if email is provided in the URL params
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label={t('pages.ChangePassword.new-pw')}
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
                error={errorPassword}
                helperText={errorPassword ? t('pages.ChangePassword.wrong-pw-format') : ''}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="repeatPassword"
                label={t('pages.ChangePassword.repeat-pw')}
                type="password"
                id="repeatPassword"
                autoComplete="new-password"
                value={formData.repeatPassword}
                onChange={handleChange}
                error={errorPasswordRepeat}
                helperText={errorPasswordRepeat ? t('pages.ChangePassword.no-match-pw') : ''}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {t('pages.ChangePassword.change-pw')}
              </Button>
            </Box>
          </Paper>
        )}
        {step === 3 ? (
        <div>
          <Dialog open={open} onClose={handleGoBackToLogin}>
            <DialogTitle>{t('pages.ChangePassword.change-pw-success')}</DialogTitle>
            <DialogContent>
              <p>{t('pages.ChangePassword.save-pw-warning')}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGoBackToLogin}>{t('pages.ChangePassword.go-back-to-login')}</Button>
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
              <DialogTitle>{t('pages.ChangePassword.error')}</DialogTitle>
              <DialogContent>
                <p>{t('pages.ChangePassword.change-pw-failed')}</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleGoBackToLogin}>{t('pages.ChangePassword.go-back-to-login')}</Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <div>

          </div>
        )}
      </div>
    </Container>
  );
};

export default ChangePasswordPage;
