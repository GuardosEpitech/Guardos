import React, { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, Paper } from "@mui/material";
import AllergenTags from "shared/components/menu/AllergenTags/AllergenTags";
import { deleteProduct } from "@src/services/productCalls";
import { Popup } from "@src/components/dumpComponents/popup/Popup";
import { IProduct } from "shared/models/restaurantInterfaces";
import styles from "./ProductCard.module.scss";

interface IProductCardProps {
  index: number;
  product: IProduct;
  onUpdate: Function;
}

const ProductCard = (props: IProductCardProps) => {
  const [extended, setExtended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { index, product, onUpdate } = props;

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleClick = () => {
    setExtended(!extended);
  };

  async function getOnDelete() {
    await deleteProduct(product);
    if (onUpdate) {
      await onUpdate();
    }
  }

  return (
    <Grid item xs={6} key={index} onClick={handleClick}>
      <Paper className={styles.Product} elevation={3}>
        <div className={styles.ProductHeader}>
          <h3 className={styles.ProductTitle}>{product.name}</h3>
          <DeleteIcon
            className={styles.ProductDeleteBtn}
            onClick={handleDeleteClick}
          />
          {showPopup && (
            <Popup
              message={`Are you sure you want to delete ${product.name}?`}
              onConfirm={getOnDelete}
              onCancel={() => setShowPopup(false)}
            />
          )}
        </div>
        {(extended && product.allergens) &&
          <AllergenTags dishAllergens={product.allergens} />}
        {product.ingredients?.length > 0 &&
          <span className={extended ?
            styles.IngredientList : styles.IngredientListWrap}>
            <b>
              {"Ingredients: "}
            </b>
            {product.ingredients?.join(", ")}</span>}
      </Paper>
    </Grid>
  );
};

export default ProductCard;
