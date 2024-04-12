import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import { IProductFE } from "shared/models/productInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/EditProductPage/EditProductPage.module.scss";
import { getAllResto } from "@src/services/restoCalls";
import { IRestaurantFrontEnd }
  from "shared/models/restaurantInterfaces";
import {useTranslation} from "react-i18next";

interface IEditProductPageProps {
  product: IProductFE;
}

const EditProductPage = () => {
  const { product } = useLocation().state as IEditProductPageProps;
  const { name, id, allergens, ingredients, restaurantId }
    = product;
  const [restoNameList, setRestoNameList] = useState<Array<IRestaurantFrontEnd>>([]);
  const [isLoading, setIsLoading] = useState(true);
  let restoNameListTemp = [] as IRestaurantFrontEnd[];
  const {t} = useTranslation();

  useEffect(() => {
    getAllResto()
      .then((res) => {
        const newFilteredList = res.filter((option: IRestaurantFrontEnd) =>
          restaurantId.includes(option.uid));
        setRestoNameList(newFilteredList);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>
          {t('pages.EditProductPage.edit-product')}
        </span>
      </div>
      <Layout>
        {isLoading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <ProductForm
            productName={name}
            productIngredients={ingredients}
            productAllergens={allergens}
            productRestaurant={restoNameList}
            productRestaurantIds={restaurantId}
            editable
          />
        )}
      </Layout>
    </div>
  );
};

export default EditProductPage;
