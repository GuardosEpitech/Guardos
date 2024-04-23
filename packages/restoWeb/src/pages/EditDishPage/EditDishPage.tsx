import React from "react";
import { useLocation } from "react-router-dom";

import DishForm from "@src/components/forms/DishForm/DishForm";
import { IDishFE } from "shared/models/dishInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/EditDishPage/EditDishPage.module.scss";
import {useTranslation} from "react-i18next";

interface IEditDishPageProps {
  dish: IDishFE;
}

const EditDishPage = () => {
  const { dish } = useLocation().state as IEditDishPageProps;
  const { name, uid, products, description, price, allergens, resto,
    category, picturesId }
    = dish;
  const selectResto: string[] = [resto];
  const selectAllergens: string[] = allergens.toString()
    .split(",");
  const selectCategories: string[] = [category.menuGroup];
  const {t} = useTranslation();

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>
          {t('pages.EditDishPage.edit-dish')}
        </span>
      </div>
      <Layout>
        <DishForm
          dishName={name}
          dishUID={uid}
          dishProducts={products}
          dishDescription={description}
          price={price}
          selectAllergene={selectAllergens}
          restoName={selectResto}
          selectCategory={selectCategories}
          picturesId={picturesId}
        />
      </Layout>
    </div>
  );
};

export default EditDishPage;
