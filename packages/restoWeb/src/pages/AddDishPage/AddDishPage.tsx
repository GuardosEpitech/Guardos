import React, {useEffect, useState} from "react";
import DishForm from "@src/components/forms/DishForm/DishForm";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/AddDishPage/AddDishPage.module.scss";
import {useTranslation} from "react-i18next";

const AddDishPage = () => {
  const {t} = useTranslation();

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
