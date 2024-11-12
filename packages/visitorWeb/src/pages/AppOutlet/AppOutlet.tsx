import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/Header/Header";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import instagram from "../../../../shared/assets/whiteInstagram.png";
import linkedIn from "../../../../shared/assets/linkedin.png";

const AppOutlet = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

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
              <li>{t('pages.AppOutlet.location')}</li>
            </ul>
          </div>
          <div>
            <ul className={styles.ListLinks}>
              <li><a onClick={() => { navigate('/terms'); }} className={styles.links}>{t('pages.AppOutlet.terms')}</a></li>
              <li><a onClick={() => { navigate('/privacy'); }} className={styles.links}>{t('pages.AppOutlet.privacy')}</a></li>
              <li><a onClick={() => { navigate('/imprint'); }} className={styles.links}>{t('pages.AppOutlet.imprint')}</a></li>
              <li><a onClick={() => { navigate('/cookiestatement'); }} className={styles.links}>{t('pages.AppOutlet.cookieStatement')}</a></li>
              <li><a onClick={() => { navigate('/contact'); }} className={styles.links}>{t('pages.AppOutlet.contactPage')}</a></li>
              <li><a className={styles.links} onClick={() => { navigate('/intropage'); }}>{t('pages.AppOutlet.welcomeSite')}</a></li>
            </ul>
          </div>
          <div>
            <div className={styles.footerIcons}>
              <a className={styles.links}><img src={instagram} alt={t('pages.AppOutlet.instagram')} tabIndex={0} /></a>
              <a className={styles.links}><img src={linkedIn} alt={t('pages.AppOutlet.linkedIn')} tabIndex={0} /></a>
            </div>
            <p className={styles.footerTrademark}>{t('pages.AppOutlet.tradeMark')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppOutlet;
