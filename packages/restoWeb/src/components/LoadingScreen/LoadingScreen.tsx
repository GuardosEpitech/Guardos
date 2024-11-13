// LoadingScreen.js
import React from "react";
import styles from "@src/components/LoadingScreen/LoadingScreen.module.scss";
import {useTranslation} from "react-i18next";

const LoadingScreen = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
      <p>{(t('pages.Loading.loading-text'))}</p>
    </div>
  );
};

export default LoadingScreen;
