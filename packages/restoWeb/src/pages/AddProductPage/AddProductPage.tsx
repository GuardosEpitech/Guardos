import React, {useEffect, useState} from "react";
import Layout from 'shared/components/Layout/Layout';
import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import styles from "@src/pages/AddProductPage/AddProductPage.module.scss";
import {useTranslation} from "react-i18next";

const AddProductPage = () => {
  const {t} = useTranslation();
  
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
