import React from "react";

import Header from "@src/components/dumpComponents/Header/Header";
import Layout from "../../../../../shared/components/Layout/Layout";
import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import styles from "@src/pages/AddProductPage/AddProductPage.module.scss";

const AddProductPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new product</span>
      </div>
      <Layout>
        <ProductForm />
      </Layout>
    </div>
  );
};

export default AddProductPage;
