import React from "react";
import styles from "./MapButton.module.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { NavigateTo } from "@src/utils/NavigateTo";
import { useNavigate } from "react-router-dom";
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

const MapButton = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  return (
    <div className={styles.DivRect}>
      <ThemeProvider theme={MapBtn()}>
        <Button
          variant="contained"
          sx={{ width: "15.44rem" }}
          onClick={() => NavigateTo("/map", navigate)}
          className={styles.goToMapButton}>
          {t('components.Map.go-to-map-view')}
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default MapButton;
