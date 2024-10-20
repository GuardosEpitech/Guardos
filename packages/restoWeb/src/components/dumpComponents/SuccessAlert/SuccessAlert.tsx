import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Alert, Snackbar } from "@mui/material";
import {useTranslation} from "react-i18next";

const HomePage = (props:any) => {
  const [hidden, setHidden] = React.useState(true);
  const objectName = props.objectName;
  let successfulForm = useLocation().state?.successfulForm;
  const {t} = useTranslation();

  useEffect(() => {
    if (successfulForm === true) {
      setHidden(false);
    }
    successfulForm = false;
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setHidden(true);
  };

  return (
    <Snackbar open={!hidden} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {t('components.SuccessAlert.success-msg', {objectName: objectName})}
      </Alert>
    </Snackbar>
  );
};

export default HomePage;
