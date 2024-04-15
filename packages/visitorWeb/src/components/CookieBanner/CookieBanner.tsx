import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import styles from "./CookieBanner.module.scss";
import {useTranslation} from "react-i18next";
import { setUserPreferences } from "../../services/profileCalls";

const OkBtn = () => {
    return createTheme({
      typography: {
        button: {
          fontFamily: "Montserrat",
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
          fontFamily: "Montserrat",
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
    return (
        <div className={styles["slider-button"]}>
        <span>{name}</span>
        {name === "Strictly necessary" ? (
          <Switch
            checked={true}
            disabled={true}
            color="primary"
            className={styles["switch"]}
          />
        ) : (
          <Switch
            checked={isActive}
            onChange={onClick}
            color="primary"
            className={styles["switch"]}
          />
        )}
      </div>
    );
  };

const CookieBanner: React.FC = () => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [sliderButtons, setSliderButtons] = useState([
    { name: "Strictly necessary", isActive: true },
    { name: "Functional", isActive: false },
    { name: "Statistical", isActive: false },
    { name: "Marketing", isActive: false },
  ]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('visitedBefore');

    if (hasVisitedBefore) {
      setIsOpen(false);
    } else {
      localStorage.setItem('visitedBefore', 'true');
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
      return;
    }
    const response = await setUserPreferences(userToken, data);
    if (response == "OK") {
      handleClose();
    }
  };

  const handleOk = async () => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const data: { [key: string]: boolean } = {};

    sliderButtons.slice(1).forEach(button => {
      data[button.name.toLowerCase()] = button.isActive;
    });
    
    const response = await setUserPreferences(userToken, data);
    if (response == "OK") {
      handleClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div>
          <div className={styles.overlay}></div>
          <div className={styles["cookie-banner-overlay"]}>
          <div className={styles["cookie-banner"]}>
            <h2>{t('components.CookieBanner.title')}</h2>
            <p>
            {t('components.CookieBanner.intro')}
            </p>
            <ul>
              <li>
              {t('components.CookieBanner.txt1')}<strong>{t('components.CookieBanner.func')}</strong>
              </li>
              <li>
              {t('components.CookieBanner.txt2')}<strong>{t('components.CookieBanner.statistical')}</strong>
              </li>
              <li>
              {t('components.CookieBanner.txt3')}<strong>{t('components.CookieBanner.marketing')}</strong>
              </li>
            </ul>
            <p>
            {t('components.CookieBanner.txt4')}<strong>{t('components.CookieBanner.ok')}</strong>{t('components.CookieBanner.txt5')}
            </p>
            <p>
            {t('components.CookieBanner.txt6')}<a href="/privacy-policy">{t('components.CookieBanner.privacy')}</a>{t('components.CookieBanner.and')}<a href="/cookiestatement">{t('components.CookieBanner.cookie')}</a>.
              {/*  In alignment with{" "}
              <a href="https://policies.google.com/privacy">Google's privacy policy</a> requirements, we ensure transparency and control over your data. */}
            </p>
            <div className={styles["button-container"]}>
                <ThemeProvider theme={DeclineBtn()}>
                <Button
                    className={styles["decline-button"]}
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
                    {t('components.CookieBanner.ok')}
                </Button>
              </ThemeProvider>
            </div>
            <div className={styles["slider-container"]}>
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
