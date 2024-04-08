import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

import DishForm from "@src/components/forms/DishForm/DishForm";
import { IDishFE } from "shared/models/dishInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/EditDishPage/EditDishPage.module.scss";
import { enable, disable, setFetchMethod } from "darkreader";

interface IEditDishPageProps {
  dish: IDishFE;
}

const EditDishPage = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { dish } = useLocation().state as IEditDishPageProps;
  const { name, uid, products, description, price, allergens, resto,
    category, picturesId }
    = dish;
  const selectResto: string[] = [resto];
  const selectAllergens: string[] = allergens.toString()
    .split(",");
  const selectCategories: string[] = [category.menuGroup];

  useEffect(() => {
    toggleDarkMode();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  
    if (!isDarkMode) {
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
      });
    } else {
      disable();
    }
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };
  
  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>Edit dish</span>
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
