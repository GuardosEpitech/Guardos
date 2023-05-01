import React from "react";

import DishForm from "@src/components/forms/DishForm/DishForm";
import Header from "@src/components/dumpComponents/Header/Header";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/AddDishPage/AddDishPage.module.scss";

const AddDishPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new dish</span>
      </div>
      <Layout>
        <DishForm add />
      </Layout>
    </div>
  );
};

export default AddDishPage;
