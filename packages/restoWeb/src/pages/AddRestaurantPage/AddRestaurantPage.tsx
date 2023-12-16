import React from "react";

import Layout from 'shared/components/Layout/Layout';
import RestaurantForm
  from "@src/components/forms/RestaurantForm/RestaurantForm";
import styles from "@src/pages/AddRestaurantPage/AddRestaurantPage.module.scss";

const AddRestaurantPage = () => {
  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new restaurant</span>
      </div>
      <Layout>
        <RestaurantForm add />
      </Layout>
    </div>
  );
};

export default AddRestaurantPage;
