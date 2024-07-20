import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/dumpComponents/Header/Header";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";
import instagram from "../../../../shared/assets/whiteInstagram.png";
import linkedIn from "../../../../shared/assets/linkedin.png";

const AppOutlet = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const visitorIntroPageURL = `${process.env.RESTAURANT_URL}/intropage`;

  useEffect(() => {
    checkDarkMode();
  }, []);

  return (
    <div className={styles.ParentElement}>
      <div className={styles.ContentElement}>
        <Header/>
        <Outlet />
      </div>
      <div className={styles.Container}>
        <div className={styles.TextContainer}>
          <div>
            <h2 className={styles.ContactTitle}>{t('pages.AppOutlet.contact')}</h2>
            <ul className={styles.ListContact}>
              <li>{t('pages.AppOutlet.email')}</li>
              <li>{t('pages.AppOutlet.phone')}</li>
              <li>{t('pages.AppOutlet.location')}</li>
            </ul>
          </div>
          <div>
            <ul className={styles.ListLinks}>
              <li><a href="/privacy" className={styles.links}>{t('pages.AppOutlet.privacy')}</a></li>
              <li><a href="/imprint" className={styles.links}>{t('pages.AppOutlet.imprint')}</a></li>
              <li><a href="/cookiestatement" className={styles.links}>{t('pages.AppOutlet.cookieStatement')}</a></li>
              <li><a className={styles.links} href={visitorIntroPageURL}>{t('pages.AppOutlet.welcomeSite')}</a></li>
            </ul>
          </div>
          <div>
            <div className={styles.footerIcons}>
              <a className={styles.links}><img src={instagram} alt={t('pages.AppOutlet.instagram')} tabIndex={0}/></a>
              <a className={styles.links}><img src={linkedIn} alt={t('pages.AppOutlet.linkedIn')} tabIndex={0}/></a>
            </div>
            <p className={styles.footerTrademark}>{t('pages.AppOutlet.tradeMark')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppOutlet;
