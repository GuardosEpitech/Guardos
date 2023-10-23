import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import Header from "@src/components/dumpComponents/Header/Header";
import { IProductFE } from "shared/models/productInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/EditProductPage/EditProductPage.module.scss";
import { getAllResto } from "@src/services/restoCalls";
import { IIngredient, IProduct, IRestaurantFrontEnd, IRestoName }
  from "shared/models/restaurantInterfaces";

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

  useEffect(() => {
    getAllResto()
      .then((res) => {
        const newFilteredList = res.filter((option: IRestaurantFrontEnd) => restaurantId.includes(option.id));
        setRestoNameList(newFilteredList);
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 700);
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>Edit product</span>
      </div>
      <Layout>
        {isLoading ? (
          <p>Loading...</p>
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
