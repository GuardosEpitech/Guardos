import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

import Layout from 'shared/components/Layout/Layout';
import RestaurantForm
  from "@src/components/forms/RestaurantForm/RestaurantForm";
import styles
  from "@src/pages/EditRestaurantPage/EditRestaurantPage.module.scss";
import {useTranslation} from "react-i18next";

interface IOpeningHours {
  open?: string;
  close?: string;
  day?: number;
}

interface IEditRestaurantPageProps {
  restoName: string;
  restoId?: number;
  phone: string;
  street: string;
  streetNumber: number;
  postalCode: string;
  city: string;
  country: string;
  description: string;
  picturesId: number[];
  menuDesignID: number;
  restoChainID: number;
  website: string;
  openingHours: IOpeningHours[];
}

const EditRestaurantPage = () => {
  const {
    restoName,
    restoId,
    phone,
    street,
    streetNumber,
    postalCode,
    city,
    country,
    description,
    picturesId,
    menuDesignID,
    restoChainID,
    website,
    openingHours
  } = useLocation().state as IEditRestaurantPageProps;
  const {t} = useTranslation();

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
          restoId={restoId}
          phone={phone}
          street={street}
          streetNumber={streetNumber}
          postalCode={postalCode}
          city={city}
          country={country}
          description={description}
          picturesId={picturesId}
          menuDesignID={menuDesignID}
          restoChainID={restoChainID}
          website={website}
          openingHours={openingHours}
        />
      </Layout>
    </div>
  );
};

export default EditRestaurantPage;
