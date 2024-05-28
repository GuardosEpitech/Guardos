import React, {useEffect, useState} from "react";

import EditIcon from "@mui/icons-material/Edit";
import { Grid, Paper } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlaceIcon from "@mui/icons-material/Place";

import { IRestaurantFrontEnd }
  from "shared/models/restaurantInterfaces";
import { deleteResto } from "@src/services/restoCalls";
import DishActions from "@src/components/menu/Dish/DishActions/DishActions";
import styles from "./RestoCard.module.scss";
import { Popup } from "@src/components/dumpComponents/popup/Popup";
import {getImages} from "@src/services/callImages";
import {defaultRestoImage} from 'shared/assets/placeholderImageBase64';
import { IimageInterface } from "shared/models/imageInterface";
import Rating from '@mui/material/Rating';
import { getRatingData } from "@src/services/ratingCalls";
import {useTranslation} from "react-i18next";

interface IRestoCardProps {
  resto: IRestaurantFrontEnd;
  onUpdate: Function;
  editable?: boolean;
}

interface IDay {
  id?: number;
  name?: string;
}

// TODO: apply i18n
const days: IDay[] = [
  { id: 0, name: "Monday" },
  { id: 1, name: "Tuesday" },
  { id: 2, name: "Wednesday" },
  { id: 3, name: "Thursday" },
  { id: 4, name: "Friday" },
  { id: 5, name: "Saturday" },
  { id: 6, name: "Sunday" },
];

const RestoCard = (props: IRestoCardProps) => {
  const [extended, setExtended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { onUpdate, resto, editable } = props;
  const imgStr = `${resto.pictures[0]}?auto=compress&cs=tinysrgb&h=350`;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [ratingData, setRatingData] = React.useState([]);
  const {t} = useTranslation();
  const [openingHours, setOpeningHours] = useState(resto.openingHours);

  const address =
    `${resto.location.streetName} ${resto.location.streetNumber}` +
    `, ${resto.location.postalCode} ${resto.location.city}` +
    `, ${resto.location.country}`;

  const handleChildClick = (e: any) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    setExtended(!extended);
  };

  const handleDeleteClick = (e: any) => {
    setShowPopup(true);
  };

  async function getOnDelete() {
    await deleteResto(resto.name);
    await onUpdate();
  }
  const averageRating = () => {
    let sum = 0;
    if (Array.isArray(ratingData)) {
      ratingData.forEach((data) => {
        if (data.note === undefined) {
          sum += 0;
        } else {
          sum += data.note;
        }
      });
      return parseFloat((sum / ratingData.length).toFixed(1));
    } else {
      return sum;
    }
  };

  useState(() => {
    getRatingData(props.resto.name)
      .then(res => setRatingData(res));
  });

  useEffect(() => {
    async function callToImages() {
      if (resto.picturesId.length > 0) {
        const picturesId = resto.picturesId;
        const answer = await getImages(picturesId);
        // @ts-ignore
        const loadedPictures = answer.map((img) => ({
          base64: img.base64,
          contentType: img.contentType,
          filename: img.filename,
          size: img.size,
          uploadDate: img.uploadDate,
          id: img._id,
        }));
        setPictures(loadedPictures);
      } else {
        console.log("No images found");
        setPictures([{
          base64: defaultRestoImage,
          contentType: "png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    callToImages();
  }, [resto.picturesId]);

  return (
    <Paper className={styles.DishBox} elevation={3} onClick={handleClick}>
      <Grid container className={styles.flexContainer}>
        <Grid item xs={3} className={styles.GridItemImage}>
          {
            <img
              src={pictures.length > 0 ? pictures[0].base64 : defaultRestoImage}
              alt={resto.name}
              className={styles.ImageDimensions}
            />
          }
        </Grid>

        <Grid item xs={9} className={styles.GridItem}>
          <div className={styles.FlexParent}>
            <h3 className={styles.DishTitle}>{resto.name}</h3>
            {editable && (
              <>
                <DishActions
                  actionList={[
                    {
                      actionName: t('components.RestoCard.menu'),
                      actionIcon: MenuBookIcon,
                      actionRedirect: "/menu",
                      redirectProps: {
                        menu: resto.categories,
                        restoName: resto.name,
                        address: address,
                        menuDesignID: resto.menuDesignID
                      }
                    },
                    {
                      actionName: t('common.edit'),
                      actionIcon: EditIcon,
                      actionRedirect: "/editResto",
                      redirectProps: {
                        restoName: resto.name,
                        phone: resto.phoneNumber,
                        street: resto.location.streetName,
                        streetNumber: resto.location.streetNumber,
                        postalCode: resto.location.postalCode,
                        city: resto.location.city,
                        country: resto.location.country,
                        description: resto.description,
                        picturesId: resto.picturesId,
                        menuDesignID: resto.menuDesignID,
                        website: resto.website,
                        openingHours: openingHours
                      }
                    }
                  ]}
                  onDelete={handleDeleteClick}
                  className={styles.ActionMenu}
                  onClick={handleChildClick}
                />
                {showPopup && (
                  <Popup
                    message={t('components.RestoCard.confirm-delete',
                      {restoName: resto.name})}
                    onConfirm={getOnDelete}
                    onCancel={() => setShowPopup(false)}
                  />
                )}
              </>
            )}
          </div>
          <div className={styles.FlexParent}>
              <Rating name="read-only" value={averageRating()} readOnly />
              <span className={styles.AverageTxt}>
                {Array.isArray(ratingData) ? ratingData.length : 0}
              </span>
          </div>
          <div className={styles.FlexParent}>
            <PlaceIcon />
            <span className={styles.AddressText}>{address}</span>
          </div>
          <p
            className={
              extended
                ? styles.JustificationPrintExtended
                : styles.JustificationPrint
            }
          >
            {resto.description}
          </p>
          <h3>{t('components.RestoCard.opening-hours')}</h3>
          {resto.openingHours.map((index, key) => (
            <div key={key} className={styles.ContainerOpeningHours}>
              <span className={styles.DaysTextValue}>{days[key].name} :</span>
              <div>
                <span className={styles.OpenCloseTextValue}>
                  {index?.open}
                </span>
                <span className={styles.OpenCloseTextValue}>
                  {index?.close}
                </span>
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RestoCard;
