import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from "@mui/material/Button";
import { Grid, Paper } from "@mui/material";
import styles from "./RestoCard.module.scss";

import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import RatingDisplay from "@src/components/RestoCard/Rating/Rating";
import RestoDetailOverlay from "@src/components/RestoDetailOverlay/RestoDetailOverlay";
import { NavigateTo } from "@src/utils/NavigateTo";
import {defaultRestoImage} from "shared/assets/placeholderImageBase64";
import {IimageInterface} from "../../../../shared/models/imageInterface";
import {getImages} from "@src/services/imageCalls";
import {addRestoAsFavourite, deleteRestoFromFavourites} from "@src/services/favourites";

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
  isFavourite: boolean,
  dataIndex: number,
  key: number,
}

const RestoCard = (props: IRestoCardProps) => {
  const navigate = useNavigate();
  const [extended, setExtended] = useState(false);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(props.isFavourite);
  const { name, rating, description, categories, ratingCount, picturesId } = props.resto;
  const { streetName, streetNumber, postalCode, city, country } = props.resto.location;
  const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const handleClick = () => {
    setExtended((prevState) => !prevState);
  }

  useEffect(() => {
    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        setPictures(fetchedImages);
      } else {
        setPictures([{
          base64: defaultRestoImage,
          contentType: "image/png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    fetchImages();
  }, [picturesId]);

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the card click event from triggering

    // Toggle the favorite status
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    if (!isFavorite) {
      addRestoAsFavourite(userToken, props.resto.uid);
    } else {
      deleteRestoFromFavourites(userToken, props.resto.uid);
    }
  };

  return (
    <Paper id="resto-card" className={styles.DishBox} elevation={3} onClick={handleClick}>
      <Grid container>
        <Grid item xs={3} className={styles.GridItemImage}>
          {pictures.length > 0 &&
              <img
                  key={pictures[0].id+name}
                  src={pictures[0].base64}
                  alt={name}
                  className={styles.ImageDimensions}
              />
          }
        </Grid>

        <Grid item xs={9} className={styles.GridItem}>
          <div className={styles.FlexParent}>
            <h3 className={styles.DishTitle}>{name}</h3>
            <RatingDisplay restoRating={rating} restoRatingsCount={ratingCount} restoName={name} />
            <div className={styles.FavoriteIcon} onClick={handleFavoriteClick}>
              {isFavorite ? (
                <FavoriteIcon id="favourite" color="error" />
              ) : (
                <FavoriteBorderIcon id="no-favourite" color="error" />
              )}
            </div>

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
                  restoID: props.resto.uid,
                  address: address,
                })}
              >
                Menu
              </Button>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
      {isDetailPageOpen && <RestoDetailOverlay restaurant={props.resto} onClose={() => setIsDetailPageOpen(false)}
                                               pictureBase64={pictures[0].base64} />}
    </Paper>
  );
};

export default RestoCard;
