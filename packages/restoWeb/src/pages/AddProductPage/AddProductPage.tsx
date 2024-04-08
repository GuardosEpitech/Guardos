import React, {useEffect, useState} from "react";
import Layout from 'shared/components/Layout/Layout';
import ProductForm from "@src/components/forms/ProductForm/ProductForm";
import styles from "@src/pages/AddProductPage/AddProductPage.module.scss";
import { enable, disable, setFetchMethod } from "darkreader";

const AddProductPage = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
        <span className={styles.TitleSearch}>My new product</span>
      </div>
      <Layout>
        <ProductForm />
      </Layout>
    </div>
  );
};

export default AddProductPage;
