import React from 'react';
import { Paper, Grid, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './AdCard.module.scss';
import defaultAdImage from '@src/assets/amazon_ad.png';
import { useTranslation } from 'react-i18next';

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: 'Calibri',
        textTransform: 'none',
        fontSize: '1.13rem',
        fontWeight: '500',
        padding: '0'
      },
    },
    palette: {
      primary: {
        main: '#6d071a',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#094067',
        contrastText: '#ffffff',
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

const AdCard = () => {
  const {t} = useTranslation();
  const handleAdClick = () => {
    window.open('https://www.amazon.com/ref=nav_logo', '_blank');
  };

  return (
    <Paper className={styles.AdCard} elevation={3} onClick={handleAdClick}>
      <Grid container>
        <Grid item xs={12} sm={3} className={styles.GridItemImage}>
          <img src={defaultAdImage} alt="Advertisement" className={styles.ImageDimensions} />
        </Grid>
        <Grid item xs={12} sm={9} className={styles.GridItem}>
          <h3 className={styles.AdTitle}>{t('components.AdCard.title')}</h3>
          <p className={styles.AdDescription}>
            {t('components.AdCard.description')}
          </p>
          <div className={styles.BtnPage}>
            <ThemeProvider theme={PageBtn()}>
              <Button className={styles.AdBtn} variant="contained">
                {t('components.AdCard.link')}
              </Button>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdCard;
