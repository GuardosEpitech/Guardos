import React from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";

import styles from "./MapButton.module.scss";
import {useTranslation} from "react-i18next";

const MapBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
      },
    },
    palette: {
      primary: {
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5
    }
  });
};

const MapButton = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.DivRect}>
      <ThemeProvider theme={MapBtn()}>
        <Button variant="contained" sx={{ width: "15.44rem" }}>
          {t('components.MapButton.enter-map-view')}
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default MapButton;
