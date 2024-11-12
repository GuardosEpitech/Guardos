import React from 'react';
import styles from './RestoOverViewPage.module.scss';
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import home from "../../assets/home.png";
import restaurant from "../../assets/restaurant.png";
import ingredient from "../../assets/ingredient.png";
import dish from "../../assets/dish.png";
import chain from "../../assets/categorization.png";


const RestoOverViewPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.App}>
      <div className={styles.tileContainer}>
        <a onClick={() => { navigate('/'); }} className={styles.tile}>
          <div className={styles.icon}><img src={home}/></div>
          <div className={styles.text}>{t('common.my-restos')}</div>
        </a>
        <a onClick={() => { navigate('/addCategory'); }} className={styles.tile}>
          <div className={styles.icon}><img src={chain}/></div>
          <div className={styles.text}>{t('common.my-category')}</div>
        </a>
        <a onClick={() => { navigate('/addRestoChain'); }} className={styles.tile}>
          <div className={styles.icon}><img src={restaurant}/></div>
          <div className={styles.text}>{t('common.my-restochain')}</div>
        </a>
        <a onClick={() => { navigate('/dishes'); }} className={styles.tile}>
          <div className={styles.icon}><img src={dish}/></div>
          <div className={styles.text}>{t('common.my-dishes')}</div>
        </a>
        <a onClick={() => { navigate('/products'); }} className={styles.tile}>
          <div className={styles.icon}><img src={ingredient}/></div>
          <div className={styles.text}>{t('common.my-products')}</div>
        </a>
      </div>
    </div>
  );
};

export default RestoOverViewPage;
