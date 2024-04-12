import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/dumpComponents/Header/Header";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";

const AppOutlet = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  const checkDarkMode = () => {
    if ((localStorage.getItem('darkMode')) == 'true'){
    setFetchMethod((url) => {
      return fetch(url, {
        mode: 'no-cors',
      });
    });
    enable({
      brightness: 100,
      contrast: 100,
      darkSchemeBackgroundColor: '#181a1b',
      darkSchemeTextColor: '#e8e6e3'
    },);
    } else {
      disable();
    }
  }

  return (
    <div className={styles.ParentElement}>
      <div className={styles.ContentElement}>
        <Header/>
        <Outlet />
      </div>
      <div className={styles.Container}>
        <div className={styles.TextContainer}>
          <h2 className={styles.ContactTitle}>
            {t('pages.AppOutlet.contact')}
          </h2>
          <ul className={styles.ListContact}>
            <li>{t('pages.AppOutlet.email')}</li>
            <li>{t('pages.AppOutlet.phone')}</li>
            <li>{t('pages.AppOutlet.location')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppOutlet;
