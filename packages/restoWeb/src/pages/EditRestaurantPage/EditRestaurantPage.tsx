import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

import Layout from 'shared/components/Layout/Layout';
import RestaurantForm
  from "@src/components/forms/RestaurantForm/RestaurantForm";
import styles
  from "@src/pages/EditRestaurantPage/EditRestaurantPage.module.scss";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";

interface IEditRestaurantPageProps {
  restoName: string;
  phone: string;
  street: string;
  streetNumber: number;
  postalCode: string;
  city: string;
  country: string;
  description: string;
  picturesId: number[];
  menuDesignID: number;
  website: string;
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
    description,
    picturesId,
    menuDesignID,
    website
  } = useLocation().state as IEditRestaurantPageProps;
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
        <span className={styles.TitleSearch}>
          {t('pages.EditRestaurantPage.edit-resto')}
        </span>
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
          picturesId={picturesId}
          menuDesignID={menuDesignID}
          website={website}
        />
      </Layout>
    </div>
  );
};

export default EditRestaurantPage;
