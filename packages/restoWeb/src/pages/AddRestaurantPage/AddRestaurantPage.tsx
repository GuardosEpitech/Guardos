import React, {useEffect, useState} from "react";
import Layout from 'shared/components/Layout/Layout';
import RestaurantForm
  from "@src/components/forms/RestaurantForm/RestaurantForm";
import styles from "@src/pages/AddRestaurantPage/AddRestaurantPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";


const AddRestaurantPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>
          {t('pages.AddRestaurantPage.my-new-resto')}
        </span>
      </div>
      <Layout>
        <RestaurantForm add />
      </Layout>
    </div>
  );
};

export default AddRestaurantPage;
