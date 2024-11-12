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
import {useTranslation} from "react-i18next";
import {NavigateTo} from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";

const ProductsPage = () => {
  const [productData, setProductData] = useState<Array<IProduct>>([]);
  const {t} = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    updateProductData();
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
        {productData.length === 0 ?
        (
          <div className={styles.ErrorContainer}>
            <span className={styles.ErrorHeader}>
              {t('pages.ProductsPage.noprod')}
            </span>
            <br/>
            <br/>
            <br/>
            <span className={styles.ErrorText}>
              {t('pages.ProductsPage.noprod2')} 
              <a onClick={() => { navigate('/addProduct'); }}>{t('pages.ProductsPage.noprod2-2')}</a>
              {t('pages.ProductsPage.noprod2-3')}
            </span>
            <br/>
            <span className={styles.ErrorText}>
              {t('pages.ProductsPage.noprod3')} 
              <a onClick={() => { navigate('/addResto'); }}>{t('pages.ProductsPage.noprod3-2')}</a> 
              {t('pages.ProductsPage.noprod3-3')}
            </span>
          </div>
        ) : (
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="space-between"
          className={styles.productGrid}
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
        )}
      </Layout>
      <FixedBtn
        title={t('pages.ProductsPage.add-product')}
        redirect="/addProduct"
      />
      <SuccessAlert objectName={t('common.product')}/>
    </div>
  );
};

export default ProductsPage;
