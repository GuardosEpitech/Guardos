import React, { useEffect, useState } from 'react';
import styles from './PrivacyPage.module.scss';
import {useTranslation} from "react-i18next";


const PrivacyPage: React.FC = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('pages.Privacy.title')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.intro')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.controller')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.controllertxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.types')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.typestxt')}</p>
          <br />
          <ul className={styles.indentedList}>
            <li><strong>{t('pages.Privacy.type1')}</strong> {t('pages.Privacy.type1txt')}</li>
            <li><strong>{t('pages.Privacy.type2')}</strong> {t('pages.Privacy.type2txt')}</li>
            <li><strong>{t('pages.Privacy.type3')}</strong> {t('pages.Privacy.type3txt')}</li>
            <li><strong>{t('pages.Privacy.type4')}</strong> {t('pages.Privacy.type4txt')}</li>
          </ul>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.legal')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.legaltxt')}</p>
          <br />
          <ul className={styles.indentedList}>
            <li><strong>{t('pages.Privacy.legal1')}</strong> {t('pages.Privacy.legal1txt')}</li>
            <li><strong>{t('pages.Privacy.legal2')}</strong> {t('pages.Privacy.legal2txt')}</li>
            <li><strong>{t('pages.Privacy.legal3')}</strong> {t('pages.Privacy.legal3txt')}</li>
          </ul>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.data')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.datatxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.sharing')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.sharingtxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.rights')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.rightstxt')}</p>
          <br />
          <ul className={styles.indentedList}>
            <li><strong>{t('pages.Privacy.right1')}</strong> {t('pages.Privacy.right1txt')}</li>
            <li><strong>{t('pages.Privacy.right2')}</strong> {t('pages.Privacy.right2txt')}</li>
            <li><strong>{t('pages.Privacy.right3')}</strong> {t('pages.Privacy.right3txt')}</li>
            <li><strong>{t('pages.Privacy.right4')}</strong> {t('pages.Privacy.right4txt')}</li>
            <li><strong>{t('pages.Privacy.right5')}</strong> {t('pages.Privacy.right5txt')}</li>
            <li><strong>{t('pages.Privacy.right6')}</strong> {t('pages.Privacy.right6txt')}</li>
            <li><strong>{t('pages.Privacy.right7')}</strong> {t('pages.Privacy.right7txt')}</li>
          </ul>
          <p>{t('pages.Privacy.rightend')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.Privacy.contact')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.Privacy.contacttxt')}</p>
          <br />
          <p>{t('pages.Privacy.address')}</p>
          <p>{t('pages.Privacy.email')}</p>
          <p>{t('pages.Privacy.phone')}</p>
          <br />
          <p>{t('pages.Privacy.end')}</p>
          <br />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;