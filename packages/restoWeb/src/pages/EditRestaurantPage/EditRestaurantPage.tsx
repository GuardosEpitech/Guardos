import React from "react";
import { useLocation } from "react-router-dom";

import Layout from 'shared/components/Layout/Layout';
import RestaurantForm
  from "@src/components/forms/RestaurantForm/RestaurantForm";
import styles
  from "@src/pages/EditRestaurantPage/EditRestaurantPage.module.scss";

interface IEditRestaurantPageProps {
  restoName: string;
  phone: string;
  street: string;
  streetNumber: number;
  postalCode: string;
  city: string;
  country: string;
  description: string;
}

const EditRestaurantPage = () => {
  const {
    restoName,
    phone,
    street,
    streetNumber,
    postalCode,
    city,
    country,
    description
  } = useLocation().state as IEditRestaurantPageProps;

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>Edit restaurant</span>
      </div>
      <Layout>
        <RestaurantForm
          restaurantName={restoName}
          phone={phone}
          street={street}
          streetNumber={streetNumber}
          postalCode={postalCode}
          city={city}
          country={country}
          description={description}
        />
      </Layout>
    </div>
  );
};

export default EditRestaurantPage;
