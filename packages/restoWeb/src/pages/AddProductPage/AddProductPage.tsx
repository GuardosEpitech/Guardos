import React, {useEffect, useState} from "react";
import Layout from 'shared/components/Layout/Layout';
import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import styles from "@src/pages/AddProductPage/AddProductPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const AddProductPage = () => {
  const {t} = useTranslation();
  
  useEffect(() => {
    checkDarkMode();
  }, []);
  
  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>
          {t('pages.AddProductPage.my-new-product')}
        </span>
      </div>
      <Layout>
        <ProductForm />
      </Layout>
    </div>
  );
};

export default AddProductPage;
