import React, {useEffect, useState} from "react";
import { Grid, Paper } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import styles from "@src/components/menu/Dish/Dish.module.scss";
import AllergenTags from "shared/components/menu/AllergenTags/AllergenTags";
import {IimageInterface} from "shared/models/imageInterface";
import {getImages} from "@src/services/imageCalls";
import {defaultDishImage} from "shared/assets/placeholderImageBase64";
import {displayImageFromBase64} from "shared/utils/imageConverter";
import {
  addDishAsFavourite,
  deleteDishFromFavourites,
} from "@src/services/favourites";

interface IDishProps {
  dishName: string;
  dishAllergens: string[];
  dishDescription: string;
  options?: string;
  picturesId: number[];
  price: number;
  restoID: number;
  dishID: number;
  isFavourite: boolean;
}

const Dish = (props: IDishProps) => {
  const [extended, setExtended] = useState(false);
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { dishName, dishAllergens, dishDescription, options, price, picturesId } = props;
  const priceStr = `${price.toFixed(2)} €`;

  useEffect(() => {
    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        // @ts-ignore
        setPictures(fetchedImages.map(img => ({
          base64: img.base64,
          contentType: img.contentType,
          filename: img.filename,
          size: img.size,
          uploadDate: img.uploadDate,
          id: img.id,
        })));
      } else {
        setPictures([{
          base64: defaultDishImage,
          contentType: "image/png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    fetchImages();
    setIsFavorite(props.isFavourite);
  }, [props.isFavourite, picturesId]);

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the card click event from triggering

    // Toggle the favorite status
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    if (!isFavorite) {
      console.log("adding dish as favourite: " + props.restoID + " " + props.dishID);
      addDishAsFavourite(userToken, props.restoID, props.dishID);
    } else {
      console.log("delete dish as favourite: " + props.restoID + " " + props.dishID);
      deleteDishFromFavourites(userToken, props.restoID, props.dishID);
    }
  };

  return (
    <Paper
      id="dish-card"
      className={styles.DishBox}
      elevation={3}
      onClick={() => setExtended(!extended)}
    >
      {/*mobile version of dish element*/}
      <div className={styles.MobileVersion}>
        <Grid container justifyContent={"space-between"}>
          <Grid
            item
            className={extended ? styles.GridItem : styles.FlexGridItem}
          >
            <div className={styles.FlexParent}>
              <h3 className={styles.DishTitle}>{dishName}</h3>
              <div className={styles.FavoriteIcon} onClick={handleFavoriteClick}>
                {isFavorite ? (
                  <FavoriteIcon id="favourite" color="error" />
                ) : (
                  <FavoriteBorderIcon id="no-favourite" color="error" />
                )}
              </div>
            </div>
            {extended && <AllergenTags dishAllergens={dishAllergens} />}
          </Grid>
          <Grid item className={styles.FlexParent}>
            {pictures.map((picture, index) => (
                <img key={index} src={`${picture.base64}`}
                     alt={`Dish Image ${index}`} className={styles.ImageDimensions} />
            ))}
          </Grid>
          <Grid item xs={12} className={styles.GridItemDescription}>
            <p
              className={
                extended
                  ? styles.JustificationPrintExtended
                  : styles.JustificationPrint
              }
            >
              {dishDescription}
            </p>
            <span className={styles.OptionsText}>
              {options && options.length != 0 && (
                <div className={!extended && styles.OptionsWrap}>
                  <b>{"Options: "}</b>
                  {options}
                </div>
              )}
            </span>
            <h3>{priceStr}</h3>
          </Grid>
        </Grid>
      </div>

      {/*web version of dish element*/}
      <div className={styles.WebVersion}>
        <Grid container>
          <Grid item xs={10} className={styles.GridItem}>
            <div className={styles.FlexParent}>
              <h3 className={styles.DishTitle}>{dishName}</h3>
              <div className={styles.FavoriteIcon} onClick={handleFavoriteClick}>
                {isFavorite ? (
                  <FavoriteIcon id="favourite" color="error" />
                ) : (
                  <FavoriteBorderIcon id="no-favourite" color="error" />
                )}
              </div>
            </div>
            {/*TODO: change allergens to products list*/}
            {extended && <AllergenTags dishAllergens={dishAllergens} />}
            <p
              className={
                extended
                  ? styles.JustificationPrintExtended
                  : styles.JustificationPrint
              }
            >
              {dishDescription}
            </p>
            <span className={styles.OptionsText}>
              {options && options.length !== 0 && (
                <div className={!extended && styles.OptionsWrap}>
                  <b>Options: </b>
                  {options}
                </div>
              )}
            </span>
            <h3 className={styles.DishPrice}>{priceStr}</h3>
          </Grid>

          <Grid item xs={2} className={styles.GridItemImage}>
            {pictures.map((picture, index) => (
                <img key={index} src={`${picture.base64}`}
                     alt={`Dish Image ${index}`} className={styles.ImageDimensions} />
            ))}
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default Dish;
