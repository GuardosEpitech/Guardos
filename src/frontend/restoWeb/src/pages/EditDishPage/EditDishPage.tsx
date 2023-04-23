import React from "react";
import { useLocation } from "react-router-dom";

import DishForm from "@src/components/forms/DishForm/DishForm";
import Header from "@src/components/dumpComponents/Header/Header";
import { IDishFE } from "@src/model/dishInterfaces";
import Layout from "@src/components/dumpComponents/Layout/Layout";
import styles from "@src/pages/EditDishPage/EditDishPage.module.scss";

interface IEditDishPageProps {
  dish: IDishFE;
}

const EditDishPage = () => {
  const { dish } = useLocation().state as IEditDishPageProps;
  const { name, products, description, price, allergens, resto, category }
    = dish;
  const selectResto: string[] = [resto];
  const selectAllergens: string[] = allergens.toString()
    .split(",");
  const selectCategories: string[] = [category.menuGroup];

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>Edit dish</span>
      </div>
      <Layout>
        <DishForm
          dishName={name}
          dishProducts={products}
          dishDescription={description}
          price={price}
          selectAllergene={selectAllergens}
          restoName={selectResto}
          selectCategory={selectCategories}
        />
      </Layout>
    </div>
  );
};

export default EditDishPage;
