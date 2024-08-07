import React, { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { Grid, Paper } from "@mui/material";
import AllergenTags from "shared/components/menu/AllergenTags/AllergenTags";
import { deleteProduct } from "@src/services/productCalls";
import { Popup } from "@src/components/dumpComponents/popup/Popup";
import { IProduct } from "shared/models/restaurantInterfaces";
import styles from "./ProductCard.module.scss";
import ProductActions from
  "@src/components/ProductCard/ProductActions/ProductActions";
import {useTranslation} from "react-i18next";

interface IProductCardProps {
  index: number;
  product: IProduct;
  onUpdate: Function;
  editable?: boolean;
}

const ProductCard = (props: IProductCardProps) => {
  const [extended, setExtended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { index, product, onUpdate, editable } = props;
  const {t} = useTranslation();

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleClick = () => {
    setExtended(!extended);
  };

  async function getOnDelete() {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
      return;
    }

    await deleteProduct(product, userToken);
    if (onUpdate) {
      setShowPopup(false);
      await onUpdate();
    }
  }

  const handleChildClick = (e: any) => {
    e.stopPropagation();
  };


  return (
    <Grid item xs={6} key={index} onClick={handleClick} className={styles.productCard}>
      <Paper className={styles.Product} elevation={3}>
        <div className={styles.ProductHeader}>
          <h3 className={styles.ProductTitle}>{product.name}</h3>
          {editable && (
            <>
              <ProductActions
                actionList={[{
                  actionName: t('common.edit'),
                  actionIcon: EditIcon,
                  actionRedirect: "/editProduct",
                  redirectProps: { product: product }
                }]}
                onDelete={handleDeleteClick}
                onClick={handleChildClick}
              />
              {showPopup && (
                <Popup
                  message={t('components.ProductCard.confirm-delete',
                    {productName: product.name})}
                  onConfirm={getOnDelete}
                  onCancel={() => setShowPopup(false)}
                />
              )}
            </>
          )}
        </div>
        {(extended && product.allergens) &&
          <AllergenTags dishAllergens={product.allergens} />}
        {product.ingredients?.length > 0 &&
          <span className={extended ?
            styles.IngredientList : styles.IngredientListWrap}>
            <b>
              {t('components.ProductCard.ingredients')}
            </b>
            {product.ingredients?.join(", ")}</span>}
      </Paper>
    </Grid>
  );
};

export default ProductCard;
