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
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const ProductsPage = () => {
  const [productData, setProductData] = useState<Array<IProduct>>([]);
  const {t} = useTranslation();

  useEffect(() => {
    updateProductData();
    checkDarkMode();
  }, []);

  const updateProductData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getProductsByUser(userToken)
      .then((res) => {
        setProductData(res);
      });
  };
  
  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-products')}</span>
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
      <FixedBtn
        title={t('pages.ProductsPage.add-product')}
        redirect="/addProduct"
      />
      <SuccessAlert />
    </div>
  );
};

export default ProductsPage;
