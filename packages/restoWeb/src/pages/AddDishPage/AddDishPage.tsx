import React, {useEffect, useState} from "react";
import DishForm from "@src/components/forms/DishForm/DishForm";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/AddDishPage/AddDishPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";

const AddDishPage = () => {
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
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('pages.AddDishPage.my-new-dish')}</span>
      </div>
      <Layout>
        <DishForm add dishUID={-1} />
      </Layout>
    </div>
  );
};

export default AddDishPage;
