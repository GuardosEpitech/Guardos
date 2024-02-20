import React, { useState } from "react";

import { Grid, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { deleteDish } from "@src/services/dishCalls";
import DishActions from "@src/components/menu/Dish/DishActions/DishActions";
import { IDishFE } from "shared/models/dishInterfaces";
import styles from "@src/components/menu/Dish/Dish.module.scss";
import { Popup } from "@src/components/dumpComponents/popup/Popup";
import {getImages} from "@src/services/callImages";
import { IimageInterface } from "shared/models/imageInterface";
import { defaultDishImage } from "shared/assets/placeholderImageBase64";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";

interface IEditableDishProps {
  dish: IDishFE;
  onUpdate?: Function;
  imageSrc?: string;
  editable?: boolean;
}

const Dish = (props: IEditableDishProps) => {
  const [extended, setExtended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { onUpdate, dish, editable } = props;
  const options = dish.category.extraGroup;
  const { name, description, price } = dish;
  const priceStr = `${price.toFixed(2)} €`;
  let picturesId: number[] = [];
  const pictures: IimageInterface[] = [];

  const handleChildClick = (e: any) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    setExtended(!extended);
  };

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  async function getOnDelete() {
    await deleteDish(dish.resto, name);
    if (onUpdate) {
      await onUpdate();
      setShowPopup(false);
    }
  }

  async function callToImages() {
    if (dish.picturesId.length > 0) {
      picturesId = dish.picturesId;
      const answer = await getImages(picturesId);
      for (let i = 0; i < answer.length; i++) {
        pictures.push({
          "base64": answer[i].base64,
          "contentType": answer[i].contentType,
          "filename": answer[i].filename,
          "size": answer[i].size,
          "uploadDate": answer[i].uploadDate,
          "id": answer[i].id,
        });
        console.log("Image found: " + dish.name);
      }
    } else {
      pictures.push({
        "base64": defaultDishImage,
        "contentType": "png",
        "filename": "placeholderResto.png",
        "size": 0,
        "uploadDate": "0",
        "id": 0,
      });
    }
  }

  callToImages()
    .then(() => {
      for (let i = 0; i < pictures.length; i++) {
        displayImageFromBase64(pictures[i].base64, dish.name+"abc");
      }
    });

  return (
    <Paper className={styles.DishBox} elevation={3} onClick={handleClick}>
      {/*mobile version of dish element*/}
      <div className={styles.MobileVersion}>
        <Grid container justifyContent="space-between">
          <Grid
            item
            className={extended ? styles.GridItem : styles.FlexGridItem}
          >
            <div className={styles.FlexParent}>
              <h3 className={styles.DishTitle}>{name}</h3>
              {editable && (
                <>
                  <DishActions
                    actionList={[{
                      actionName: "Edit",
                      actionIcon: EditIcon,
                      actionRedirect: "/editDish",
                      redirectProps: { dish: dish }
                    }]}
                    onDelete={handleDeleteClick}
                    onClick={handleChildClick}
                  />
                  {showPopup && (
                    <Popup
                      message={`Are you sure you want to delete ${dish.name}?`}
                      onConfirm={getOnDelete}
                      onCancel={() => setShowPopup(false)}
                    />
                  )}
                </>
              )}
            </div>
            {/* {extended && <AllergenTags dishAllergens={allergens.split(",")} />} */}
          </Grid>
          <Grid item className={styles.FlexParent}>
            <img
              id={dish.name}
              alt="DishPicture"
              className={styles.ImageDimensions}
            />
          </Grid>
          <Grid item xs={12} className={styles.GridItemDescription}>
            <p
              className={
                extended
                  ? styles.JustificationPrintExtended
                  : styles.JustificationPrint
              }
            >
              {description}
            </p>
            <span className={styles.OptionsText}>
              {options && options.length !== 0 && (
                <div className={!extended && styles.OptionsWrap}>
                  <b>{"Options: "}</b>
                  {options}
                </div>
              )}
            </span>
            <h3>{`${price.toFixed(2)} €`}</h3>
          </Grid>
        </Grid>
      </div>

      {/*web version of dish element*/}
      <div className={styles.WebVersion}>
        <Grid container>
          <Grid item xs={10} className={styles.GridItem}>
            <div className={styles.FlexParent}>
              <h3 className={styles.DishTitle}>{name}</h3>
              {editable && (
                <>
                  <DishActions
                    actionList={[{
                      actionName: "Edit",
                      actionIcon: EditIcon,
                      actionRedirect: "/editDish",
                      redirectProps: { dish: dish }
                    }]}
                    onDelete={handleDeleteClick}
                    onClick={handleChildClick}
                  />
                  {showPopup && (
                    <Popup
                      message={`Are you sure you want to delete ${dish.name}?`}
                      onConfirm={getOnDelete}
                      onCancel={() => setShowPopup(false)}
                    />
                  )}
                </>
              )}
            </div>
            {/* {extended && <AllergenTags dishAllergens={allergens.split(",")} />} */}
            <p
              className={
                extended
                  ? styles.JustificationPrintExtended
                  : styles.JustificationPrint
              }
            >
              {description}
            </p>
            <span className={styles.OptionsText}>
              {options && options.length !== 0 && (
                <div className={!extended && styles.OptionsWrap}>
                  <b>{"Options: "}</b>
                  {options}
                </div>
              )}
            </span>
            <h3 className={styles.DishPrice}>{priceStr}</h3>
          </Grid>

          <Grid item xs={2} className={styles.GridItemImage}>
            {<img id={dish.name+"abc"} alt="new" className={styles.ImageDimensions} />}
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default Dish;
