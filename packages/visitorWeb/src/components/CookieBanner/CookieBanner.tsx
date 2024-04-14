import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import styles from "./CookieBanner.module.scss";

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
  const [isOpen, setIsOpen] = useState(true);
  const [sliderButtons, setSliderButtons] = useState([
    { name: "Strictly necessary", isActive: true },
    { name: "Functional", isActive: false },
    { name: "Statistical", isActive: false },
    { name: "Marketing", isActive: false },
  ]);

//   useEffect(() => {
//     const hasVisitedBefore = localStorage.getItem('visitedBefore');

//     if (hasVisitedBefore) {
//       setIsOpen(false);
//     } else {
//       localStorage.setItem('visitedBefore', 'true');
//     }
//   }, []);

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

  return (
    <>
      {isOpen && (
        <div>
          <div className={styles.overlay}></div>
          <div className={styles["cookie-banner-overlay"]}>
          <div className={styles["cookie-banner"]}>
            <h2>We use cookies</h2>
            <p>
              We use cookies to collect information about you. We use this information:
            </p>
            <ul>
              <li>
                1. to give you a better experience of our website{" "}
                <strong>(functional)</strong>
              </li>
              <li>
                2. to count the pages you visit <strong>(statistics)</strong>
              </li>
              <li>
                3. to serve you relevant promotions <strong>(marketing)</strong>
              </li>
            </ul>
            <p>
              Click "<strong>OK</strong>" to give us your consent to use cookies for all these purposes.
              You can also use the checkboxes to consent to specific purposes.
            </p>
            <p>
              Withdraw or change your consent at any time by clicking the icon in the bottom left corner of the screen.
              Change your settings. Read more about how we use cookies and other technologies to collect personal data:{" "}
              <a href="/privacy-policy">Privacy policy</a> and{" "}
              <a href="/cookiestatement">Cookie policy</a>.
              {/*  In alignment with{" "}
              <a href="https://policies.google.com/privacy">Google's privacy policy</a> requirements, we ensure transparency and control over your data. */}
            </p>
            <div className={styles["button-container"]}>
                <ThemeProvider theme={DeclineBtn()}>
                <Button
                    className={styles["decline-button"]}
                    variant="contained"
                    onClick={() => handleClose()}
                >
                    DECLINE ALL
                </Button>
                </ThemeProvider>
              <ThemeProvider theme={OkBtn()}>
                <Button
                    className={styles.RestoBtn}
                    variant="contained"
                    onClick={() => handleClose()}
                >
                    OK
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
