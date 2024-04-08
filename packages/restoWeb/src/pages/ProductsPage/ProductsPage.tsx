import React, { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import FixedBtn from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import {getProductsByUser} from "@src/services/productCalls";
import Layout from 'shared/components/Layout/Layout';
import ProductCard from "@src/components/ProductCard/ProductCard";
import styles from "@src/pages/ProductsPage/ProductsPage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";
import { IProduct } from "shared/models/restaurantInterfaces";
import { enable, disable, setFetchMethod } from "darkreader";

const ProductsPage = () => {
  const [productData, setProductData] = useState<Array<IProduct>>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    updateProductData();
    toggleDarkMode();
  }, []);

  const updateProductData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getProductsByUser(userToken)
      .then((res) => {
        setProductData(res);
      });
  };

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
        <span className={styles.TitleSearch}>My products</span>
      </div>
      <Layout>
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="space-between"
        >
          {productData.map((product, index) => (
            <ProductCard
              key={index}
              index={index}
              product={product}
              onUpdate={updateProductData}
              editable
            />
          ))}
        </Grid>
      </Layout>
      <FixedBtn title="Add product" redirect="/addProduct" />
      <SuccessAlert />
    </div>
  );
};

export default ProductsPage;
