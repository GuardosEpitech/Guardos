import React from 'react';
import styles from './ImprintPage.module.scss';
import {useTranslation} from "react-i18next";

const ImprintPage: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div className={styles.impressumContainer}>
      <h1>{t('pages.Imprint.title')}</h1>
      <br />
      <div className={styles.impressumInfo}>
        <p>{t('pages.Imprint.intro')}</p>
        <br />
        <p>{t('pages.Imprint.us')}</p>
        <p>{t('pages.Imprint.address1')}</p>
        <p>{t('pages.Imprint.address2')}</p>
        <br />
        <p>{t('pages.Imprint.telephone')}</p>
        <p>{t('pages.Imprint.email')}</p>
        <br />
        <p>{t('pages.Imprint.register')}</p>
        <p>{t('pages.Imprint.registerNr')}</p>
        <br />
        <p>{t('pages.Imprint.ust')}</p>
        <br />
        <p>{t('pages.Imprint.manager')}</p>
      </div>
      <div className={styles.impressumLegal}>
        <h2>{t('pages.Imprint.legal')}</h2>
        <br />
        <p>
        {t('pages.Imprint.introLegal')}
        </p>
        <br />
        <h2>
        {t('pages.Imprint.txtlegal1')}
        </h2>
        <br />
        <p>{t('pages.Imprint.txtlegal2')}{' '}
          <a
            href="http://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://ec.europa.eu/consumers/odr
          </a>{' '}
          {t('pages.Imprint.txtlegal3')}
        </p>
      </div>
    </div>
  );
};

export default ImprintPage;
