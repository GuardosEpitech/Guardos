import React, { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import styles from "@src/pages/ProductsPage/ProductsPage.module.scss";

import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const UserInsights = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-analytics')}</span>
      </div>
    </div>
  );
};

export default UserInsights;
