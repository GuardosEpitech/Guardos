import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import Button from "@mui/material/Button";
import { Grid, Paper } from "@mui/material";
import styles from "./RestoCard.module.scss";

import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import Rating from "@src/components/RestoCard/Rating/Rating";
import RestoDetailOverlay from "@src/components/RestoDetailOverlay/RestoDetailOverlay";
import { NavigateTo } from "@src/utils/NavigateTo";
import {defaultRestoImage} from "shared/assets/placeholderImageBase64";
import {displayImageFromBase64} from "shared/utils/imageConverter";
import {IimageInterface} from "../../../../shared/models/imageInterface";
import {getImages} from "@src/services/imageCalls";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
        padding: "0"
      },
    },
    palette: {
      primary: {
        main: "#6d071a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

interface IRestoCardProps {
  resto: IRestaurantFrontEnd,
  dataIndex: number,
  key: number,
}

const RestoCard = (props: IRestoCardProps) => {
  const navigate = useNavigate();
  const [extended, setExtended] = useState(false);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const { name, rating, description, categories, ratingCount, picturesId } = props.resto;
  const { streetName, streetNumber, postalCode, city, country } = props.resto.location;
  const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  const pictures: IimageInterface[] = [];
  const handleClick = () => {
    setExtended((prevState) => !prevState);
  }

  async function callToImages() {
    let picturesId;
    if (props.resto.picturesId.length > 0) {
      picturesId = props.resto.picturesId;
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
      }
    } else {
      pictures.push({
        "base64": defaultRestoImage,
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
          displayImageFromBase64(pictures[i].base64, "restoImage"+props.resto.name);
          displayImageFromBase64(pictures[i].base64, "restoImagedetails"+props.resto.name);
        }
      });

  return (
    <Paper className={styles.DishBox} elevation={3} onClick={handleClick}>
      <Grid container>
        <Grid item xs={3} className={styles.GridItemImage}>
          {pictures && (
            <img
              id={"restoImage"+props.resto.name}
              alt={name}
              className={styles.ImageDimensions}
            />
          )}
        </Grid>

        <Grid item xs={9} className={styles.GridItem}>
          <div className={styles.FlexParent}>
            <h3 className={styles.DishTitle}>{name}</h3>
            <Rating restoRating={rating} restoRatingsCount={ratingCount} />
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
            {description}
          </p>
          <div className={styles.BtnPage}>
            <ThemeProvider theme={PageBtn()}>
              <Button
                className={styles.RestoBtn}
                variant="contained"
                onClick={() => setIsDetailPageOpen(true)}
              >
                Details
              </Button>
              <Button
                className={styles.RestoBtn}
                variant="contained"
                onClick={() => NavigateTo("/menu", navigate, {
                  menu: categories,
                  restoName: name,
                  address: address,
                })}
              >
                Menu
              </Button>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
      {isDetailPageOpen && <RestoDetailOverlay restaurant={props.resto} onClose={() => setIsDetailPageOpen(false)} />}
    </Paper>
  );
};

export default RestoCard;
