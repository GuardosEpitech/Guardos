import React from "react";
import styles from "./HomeButton.module.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { NavigateTo } from "@src/utils/NavigateTo";
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const MapBackBtn = () => {
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

const BackButton = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  return (
    <div className={styles.DivRect}>
      <ThemeProvider theme={MapBackBtn()}>
        <Button variant="contained" sx={{ width: "15.44rem" }} onClick={() => NavigateTo("/", navigate)}>
          {t('components.HomeButton.go-to-list-view')}
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default BackButton;
