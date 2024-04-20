import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/dumpComponents/Header/Header";
import {useTranslation} from "react-i18next";

const AppOutlet = () => {
  const {t} = useTranslation();

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
        <div className={styles.LinksContainer}>
          <a href="/cookiestatement" className={styles.Link}>{t('pages.AppOutlet.cookieStatement')}</a>
        </div>
      </div>
    </div>
  );
};

export default AppOutlet;
