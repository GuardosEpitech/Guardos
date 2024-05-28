import React from 'react';
import styles from './ImprintPage.module.scss';
import {useTranslation} from "react-i18next";

const ImprintPage: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <h2 className={styles.title}>{t('pages.Imprint.title')}</h2>
          <hr className={styles.line} />
          <div className={styles.text}>
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
        </div>
        <div className={styles.paddingTopBottom}>
          <h2 className={styles.title}>{t('pages.Imprint.legal')}</h2>
          <hr className={styles.line} />
          <div className={styles.text}>
            <p>{t('pages.Imprint.introLegal')}</p>
          </div>
        </div>
        <div className={styles.paddingTopBottom}>
          <h2>{t('pages.Imprint.txtlegal1')}</h2>
          <hr className={styles.line} />
          <div className={styles.text}>
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
      </div>
    </div>
  );
};

export default ImprintPage;
