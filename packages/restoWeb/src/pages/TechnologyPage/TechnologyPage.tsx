import React from 'react';
import styles from './TechnologyPage.module.scss';
import {useTranslation} from 'react-i18next';

const TechnologyPage: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('pages.TechnologyPage.title')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>
            {t('pages.TechnologyPage.intro')} 
            <a href='/cookiestatement' target='_blank' rel="noopener noreferrer">{t('pages.TechnologyPage.cookie')}</a>.
          </p>
        </div>
        <h2 className={styles.title}>{t('pages.TechnologyPage.func')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.TechnologyPage.introFunc')}</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('pages.TechnologyPage.tableName')}</th>
              <th>{t('pages.TechnologyPage.tablePurpose')}</th>
              <th>{t('pages.TechnologyPage.tableShared')}</th>
              <th>{t('pages.TechnologyPage.tableLife')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>{t('pages.TechnologyPage.namePlaceholder')}</td>
                <td>{t('pages.TechnologyPage.purposePlaceholder')}</td>
                <td>{t('pages.TechnologyPage.sharedPlaceholder')}</td>
                <td>{t('pages.TechnologyPage.lifePlaceholder')}</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <h2 className={styles.title}>{t('pages.TechnologyPage.analytical')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.TechnologyPage.introAnalytical')}</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('pages.TechnologyPage.tableName')}</th>
              <th>{t('pages.TechnologyPage.tablePurpose')}</th>
              <th>{t('pages.TechnologyPage.tableShared')}</th>
              <th>{t('pages.TechnologyPage.tableLife')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('pages.TechnologyPage.namePlaceholder')}</td>
              <td>{t('pages.TechnologyPage.purposePlaceholder')}</td>
              <td>{t('pages.TechnologyPage.sharedPlaceholder')}</td>
              <td>{t('pages.TechnologyPage.lifePlaceholder')}</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <h2 className={styles.title}>{t('pages.TechnologyPage.marketing')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.TechnologyPage.introMarketing')}</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('pages.TechnologyPage.tableName')}</th>
              <th>{t('pages.TechnologyPage.tablePurpose')}</th>
              <th>{t('pages.TechnologyPage.tableShared')}</th>
              <th>{t('pages.TechnologyPage.tableLife')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('pages.TechnologyPage.namePlaceholder')}</td>
              <td>{t('pages.TechnologyPage.purposePlaceholder')}</td>
              <td>{t('pages.TechnologyPage.sharedPlaceholder')}</td>
              <td>{t('pages.TechnologyPage.lifePlaceholder')}</td>
            </tr>
            {/* Add rows of data here */}
          </tbody>
        </table>
        <br />
      </div>
    </div>
  );
};

export default TechnologyPage;
