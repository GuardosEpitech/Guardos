import React from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";

import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./FixedBtn.module.scss";

const PageBtn = () => {
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
        main: "#6D071A",
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

interface IFixedBtnProps {
  title: string;
  redirect: string;
}

const FixedBtn = (props: IFixedBtnProps) => {
  const navigate = useNavigate();
  const { title, redirect } = props;

  return (
    <div className={styles.FixedBtn}>
      <ThemeProvider theme={PageBtn()}>
        <Button
          variant="contained"
          sx={{ width: "15.13rem" }}
          onClick={() => NavigateTo(redirect, navigate)}
        >
          {title}
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default FixedBtn;
