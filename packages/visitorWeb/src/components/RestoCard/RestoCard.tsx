import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from "@mui/material/Button";
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import { Grid, Paper } from "@mui/material";
import styles from "./RestoCard.module.scss";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import RatingDisplay from "@src/components/RestoCard/Rating/Rating";
import RestoDetailOverlay from "@src/components/RestoDetailOverlay/RestoDetailOverlay";
import { defaultRestoImage } from "shared/assets/placeholderImageBase64";
import { IimageInterface } from "../../../../shared/models/imageInterface";
import { getImages } from "@src/services/imageCalls";
import { addRestoAsFavourite, deleteRestoFromFavourites } from "@src/services/favourites";
import { useTranslation } from "react-i18next";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
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
  resto: IRestaurantFrontEnd;
  isFavourite: boolean;
  dataIndex: number;
  key: number;
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
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchImages() {
      if (picturesId) {
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
    }

    fetchImages();
  }, [picturesId]);

  const handleClickInfo = () => {
    navigate(`/menu/${props.resto.uid}`, {
      state: {
        restoName: name,
        restoID: props.resto.uid,
        address: address,
        menuDesignID: props.resto.menuDesignID
      }
    });
  };
  
  const handleShareClick = (event: any) => {
    event.stopPropagation();
    const menuUrl = `${window.location.origin}/menu/${props.resto.uid}`;
    navigator.clipboard.writeText(menuUrl);
    alert(t('components.RestoCard.linkCopied'));
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    if (!isFavorite) {
      addRestoAsFavourite(userToken, props.resto.uid);
    } else {
      deleteRestoFromFavourites(userToken, props.resto.uid);
    }
  };

  const handleFavoriteKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleFavoriteClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <Paper id="resto-card" className={styles.DishBox} elevation={3} onClick={handleClick}>
      <Grid container>
        <Grid item xs={12} sm={3} className={styles.GridItemImage}>
          {pictures.length > 0 &&
              <img
                  key={pictures[0].id + name}
                  src={pictures[0].base64}
                  alt={name}
                  className={styles.ImageDimensions}
              />
          }
        </Grid>
  
        <Grid item xs={12} sm={9} className={styles.GridItem}>
          <div className={styles.FlexParent}>
            <h3 className={styles.DishTitle}>{name}</h3>
            <div 
              className={styles.FavoriteIcon} 
              tabIndex={0} 
              onClick={handleFavoriteClick} 
              onKeyDown={handleFavoriteKeyDown}
              role="button"
              aria-pressed={isFavorite}
            >
              {isFavorite ? (
                <FavoriteIcon id="favourite" color="error" />
              ) : (
                <FavoriteBorderIcon id="no-favourite" color="error" />
              )}
            </div>
          </div>
          <div className={styles.FlexParent}>
            <RatingDisplay restoRating={rating} restoRatingsCount={ratingCount} restoName={name} />
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
                {t('components.RestoCard.details')}
              </Button>
              <Button
                className={styles.RestoBtn}
                variant="contained"
                onClick={handleClickInfo}
              >
                {t('components.RestoCard.menu')}
              </Button>
              <IconButton onClick={handleShareClick} aria-label={t('components.RestoCard.share')}>
                 <ShareIcon color="primary" />
              </IconButton>
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
