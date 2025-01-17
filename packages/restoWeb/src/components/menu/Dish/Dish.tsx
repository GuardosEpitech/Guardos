import React, {useEffect, useState} from "react";

import { Grid, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PercentIcon from '@mui/icons-material/Percent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deleteDish, getDishesByID } from "@src/services/dishCalls";
import DishActions from "@src/components/menu/Dish/DishActions/DishActions";
import AllergenTags from "shared/components/menu/AllergenTags/AllergenTags";
import { IDishFE } from "shared/models/dishInterfaces";
import styles from "@src/components/menu/Dish/Dish.module.scss";
import { Popup } from "@src/components/dumpComponents/popup/Popup";
import {getImages} from "@src/services/callImages";
import { IimageInterface } from "shared/models/imageInterface";
import { defaultDishImage } from "shared/assets/placeholderImageBase64";
import {useTranslation} from "react-i18next";

interface IEditableDishProps {
  dish: IDishFE;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onUpdate?: Function;
  imageSrc?: string;
  editable?: boolean;
  isTopLevel?: boolean;
}

const Dish = (props: IEditableDishProps) => {
  const [extended, setExtended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { onUpdate, dish, editable, isTopLevel } = props;
  const options = dish.category.extraGroup;
  const { name, description, price, discount, validTill, combo, allergens } = dish;
  const priceStr = `${price.toFixed(2)} €`;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const {t} = useTranslation();
  const [recommendedDishes, setRecommendedDishes] = useState<IDishFE[]>([]);

  const handleChildClick = (e: any) => {
    e.stopPropagation();
  };

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  async function getOnDelete() {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }
    await deleteDish(dish.resto, name, userToken);
    if (onUpdate) {
      await onUpdate();
      setShowPopup(false);
    }
  }

  useEffect(() => {
    const loadImages = async () => {
      if (dish.picturesId && dish.picturesId.length > 0) {
        try {
          const answer = await getImages(dish.picturesId);
          // @ts-ignore
          setPictures(answer.map((img) => ({
            base64: img.base64,
            contentType: img.contentType,
            filename: img.filename,
            size: img.size,
            uploadDate: img.uploadDate,
            id: img.id,
          })));
        } catch (error) {
          console.error("Failed to load images", error);
          setPictures([{
            base64: defaultDishImage,
            contentType: "image/png",
            filename: "placeholder.png",
            size: 0,
            uploadDate: "",
            id: 0,
          }]);
        }
      } else {
        setPictures([{
          base64: defaultDishImage,
          contentType: "image/png",
          filename: "placeholder.png",
          size: 0,
          uploadDate: "",
          id: 0,
        }]);
      }
    };
    const getComboDishes = async () => {
      try {
        if (dish.resto === undefined) {
          return;
        }
        const userToken = localStorage.getItem('user');
        const comboDishes = await getDishesByID(dish.resto, { ids: combo, key: userToken });

        if (comboDishes) {
          const validCombos = comboDishes.filter((dish : any) => dish !== null);
          setRecommendedDishes(validCombos);
        }
      } catch (error) {
        console.error("Failed to load combo dishes", error);
      }
    };
  
    if (combo && combo.length > 0) {
      getComboDishes();
    }
  
    loadImages();
  }, [dish.picturesId, combo, onUpdate]);  // Trigger re-fetch on updates
  return (
    <Paper className={styles.DishBox} elevation={3} onClick={() => setExtended(!extended)}>
      {/*mobile version of dish element*/}
      <div className={styles.MobileVersion}>
        <Grid container justifyContent="space-between" className={styles.MobileVersion}>
          <Grid item className={styles.FlexParent}>
            <img
              src={pictures[0]?.base64 || defaultDishImage}
              alt={name}
              className={styles.ImageDimensions}
            />
          </Grid>
          <Grid item className={extended ? styles.GridItem : styles.FlexGridItem}>
            <div className={styles.FlexParentMenu}>
              <h3 className={styles.DishTitle}>{name}</h3>
              {editable && isTopLevel && (
                <>
                  <DishActions
                    actionList={[
                      {
                        actionName: t('common.edit'),
                        actionIcon: EditIcon,
                        actionRedirect: "/editDish",
                        redirectProps: { dish: dish }
                      },
                      {
                        actionName: t('common.discount'),
                        actionIcon: PercentIcon,
                        actionRedirect: "/discount",
                        redirectProps: { dish: dish}
                      },
                      {
                        actionName: t('common.combo'),
                        actionIcon: AddCircleOutlineIcon,
                        actionRedirect: "/combo",
                        redirectProps: { dish: dish}
                      }
                    ]}
                    onDelete={handleDeleteClick}
                    onClick={handleChildClick}
                  />
                  <div className={styles.popUp}>
                    {showPopup && (
                      <Popup
                        message={t('components.Dish.confirm-delete', { dishName: dish.name })}
                        onConfirm={getOnDelete}
                        onCancel={() => setShowPopup(false)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
            {extended && <AllergenTags dishAllergens={allergens} />}
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
                  <b>{t('components.Dish.options')}</b>
                  {options}
                </div>
              )}
            </span>
            {discount === -1 || discount == null ? (
              <h3>{priceStr}</h3>
            ) : (
              <div>
                <h3 className={styles.discount}>{priceStr}</h3>
                <h3>
                  {t('components.Dish.discount')} {`${discount.toFixed(2)} €`}
                </h3>
                <h3>
                  {t('components.Dish.valid')} {validTill}
                </h3>
              </div>
            )}
          </Grid>
        </Grid>
      </div>

      {/*web version of dish element*/}
      <div className={styles.WebVersion}>
        <Grid container>
          <Grid item xs={10} className={styles.GridItem}>
            <div className={styles.FlexParent}>
              <h3 className={styles.DishTitle}>{name}</h3>
              {editable && isTopLevel && (
                <>
                  <DishActions
                    actionList={[
                      {
                        actionName: t('common.edit'),
                        actionIcon: EditIcon,
                        actionRedirect: "/editDish",
                        redirectProps: { dish: dish }
                      },
                      {
                        actionName: t('common.discount'),
                        actionIcon: PercentIcon,
                        actionRedirect: "/discount",
                        redirectProps: { dish: dish}
                      },
                      {
                        actionName: t('common.combo'),
                        actionIcon: AddCircleOutlineIcon,
                        actionRedirect: "/combo",
                        redirectProps: { dish: dish}
                      }
                    ]}
                    onDelete={handleDeleteClick}
                    onClick={handleChildClick}
                  />
                  {showPopup && (
                    <div className={styles.popUp}>
                      <Popup
                        message={t('components.Dish.confirm-delete', { dishName: dish.name })}
                        onConfirm={getOnDelete}
                        onCancel={() => setShowPopup(false)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            {extended && <AllergenTags dishAllergens={allergens} />}
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
                  <b>{t('components.Dish.options')}</b>
                  {options}
                </div>
              )}
            </span>
            {discount === -1 || discount == null ? (
              <h3 className={styles.DishPrice}>{priceStr}</h3>
            ) : (
              <div>
                <h3 className={styles.discount}>{priceStr}</h3>
                <h3 className={styles.DishPrice}>
                  {t('components.Dish.discount')} {`${discount.toFixed(2)} €`}
                </h3>
                <h3 className={styles.DishPrice}>
                  {t('components.Dish.valid')} {validTill}
                </h3>
              </div>
            )}
          </Grid>

          <Grid item xs={2} className={styles.GridItemImage}>
            <img
              src={pictures[0]?.base64 || defaultDishImage}
              alt={name}
              className={styles.ImageDimensions}
            />
          </Grid>
        </Grid>

        {isTopLevel && recommendedDishes.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h4>{t('components.Dish.recommendedCombos')}</h4>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles.Combos}>
                {recommendedDishes.map((recommendedDish, index) => (
                  // Stoppe hier das Event-Bubbling, damit
                  // das Kind eigenständig geklickt werden kann:
                  <div onClick={(e) => e.stopPropagation()} key={index}>
                    <Dish
                      dish={recommendedDish}
                      editable={editable}
                      onUpdate={onUpdate}
                      isTopLevel={false}
                    />
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </Paper>
  );
};

export default Dish;
