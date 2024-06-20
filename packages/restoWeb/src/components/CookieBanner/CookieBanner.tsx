import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import styles from "./CookieBanner.module.scss";
import {useTranslation} from "react-i18next";
import { setUserRestoPreferences } from "../../services/profileCalls";

const OkBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
        padding: "0"
      },
    },
    palette: {
      primary: {
        main: "#6d071a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

const DeclineBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
        padding: "0"
      },
    },
    palette: {
      primary: {
        main: "#ffffff",
        contrastText: "#000000",
      },
      secondary: {
        main: "#999999",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

  type SliderButtonProps = {
    name: string;
    isActive: boolean;
    onClick: () => void;
  };
  
  const SliderButton: React.FC<SliderButtonProps> = ({
    name,
    isActive,
    onClick
  }) => {
    const {t} = useTranslation();
    return (
        <div className={styles.sliderButton}>
        <span>{name}</span>
        {name === t('components.CookieBanner.strictly') ? (
          <Switch
            checked={true}
            disabled={true}
            color="primary"
            className={styles.switch}
          />
        ) : (
          <Switch
            checked={isActive}
            onChange={onClick}
            color="primary"
            className={styles.switch}
          />
        )}
      </div>
    );
  };

const CookieBanner: React.FC = () => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [sliderButtons, setSliderButtons] = useState([
    { name: t('components.CookieBanner.strictly'), isActive: true },
    { name: t('components.CookieBanner.Func'), isActive: false },
    { name: t('components.CookieBanner.Statistical'), isActive: false },
    { name: t('components.CookieBanner.Marketing'), isActive: false },
  ]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('visitedRestoBefore');
    
    if (hasVisitedBefore) {
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSliderButtonClick = (index: number) => {
    setSliderButtons((prevSliderButtons) =>
      prevSliderButtons.map((button, i) =>
        i === index ? { ...button, isActive: !button.isActive } : button
      )
    );
  };

  const handleDeclineAll = async () => {
    const data = {
      functional: false,
      statistical: false,
      marketing: false
    };
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      localStorage.setItem('functional', 'false');
      localStorage.setItem('statistical', 'false');
      localStorage.setItem('marketing', 'false');
      handleClose();
      return;
    }
    const response = await setUserRestoPreferences(userToken, data);
    if (response == "OK") {
      localStorage.setItem('visitedRestoBefore', 'true');
      handleClose();
    }
  };

  const handleOk = async () => {
    const data: { [key: string]: boolean } = {};

    sliderButtons.slice(1).forEach(button => {
      data[button.name.toLowerCase()] = button.isActive;
    });
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      localStorage.setItem('functional', data[sliderButtons[1].name.toLocaleLowerCase()].toString());
      localStorage.setItem('statistical', data[sliderButtons[2].name.toLocaleLowerCase()].toString());
      localStorage.setItem('marketing', data[sliderButtons[3].name.toLocaleLowerCase()].toString());
      handleClose();
      return;
    }
    
    const response = await setUserRestoPreferences(userToken, data);
    if (response == "OK") {
      localStorage.setItem('visitedRestoBefore', 'true');
      handleClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div>
          <div className={styles.overlay}></div>
          <div className={styles.cookieBannerOverlay}>
          <div className={styles.cookieBanner}>
            <h2>{t('components.CookieBanner.title')}</h2>
            <p>
            {t('components.CookieBanner.intro')}
            </p>
            <ul>
              <li>
                {t('components.CookieBanner.txt1')}
                <strong>{t('components.CookieBanner.func')}</strong>
              </li>
              <li>
                {t('components.CookieBanner.txt2')}
                <strong>{t('components.CookieBanner.statistical')}</strong>
              </li>
              <li>
                {t('components.CookieBanner.txt3')}
                <strong>{t('components.CookieBanner.marketing')}</strong>
              </li>
            </ul>
            <p>
              {t('components.CookieBanner.txt4')}
              <strong>{t('components.CookieBanner.acceptOption')}</strong>
              {t('components.CookieBanner.txt5')}
            </p>
            <p>
              {t('components.CookieBanner.txt6')}
              <a href="/privacy">{t('components.CookieBanner.privacy')}</a>
              {t('components.CookieBanner.and')}
              <a href="/cookiestatement">{t('components.CookieBanner.cookie')}</a>.
            </p>
            <div className={styles.buttonContainer}>
                <ThemeProvider theme={DeclineBtn()}>
                <Button
                    className={styles.declineButton}
                    variant="contained"
                    onClick={() => handleDeclineAll()}
                >
                    {t('components.CookieBanner.decline')}
                </Button>
                </ThemeProvider>
              <ThemeProvider theme={OkBtn()}>
                <Button
                    className={styles.RestoBtn}
                    variant="contained"
                    onClick={() => handleOk()}
                >
                    {t('components.CookieBanner.acceptOption')}
                </Button>
              </ThemeProvider>
            </div>
            <div className={styles.sliderContainer}>
              {sliderButtons.map((button, index) => (
                <SliderButton
                key={button.name}
                name={button.name}
                isActive={button.isActive}
                onClick={() => handleSliderButtonClick(index)}
                />
            ))}
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
