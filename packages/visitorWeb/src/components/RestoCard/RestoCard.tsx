import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from "@mui/material/Button";
import { Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import styles from "./RestoCard.module.scss";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import RatingDisplay from "@src/components/RestoCard/Rating/Rating";
import RestoDetailOverlay from "@src/components/RestoDetailOverlay/RestoDetailOverlay";
import { defaultRestoImage } from "shared/assets/placeholderImageBase64";
import { IimageInterface } from "../../../../shared/models/imageInterface";
import { getImages } from "@src/services/imageCalls";
import { addRestoAsFavourite, deleteRestoFromFavourites } from "@src/services/favourites";
import { useTranslation } from "react-i18next";
import Skeleton from '@mui/material/Skeleton';

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
  pictures: IimageInterface[];
  deleteFavResto?: (restoId: number) => void;
}

const RestoCard = (props: IRestoCardProps) => {
  const navigate = useNavigate();
  const [extended, setExtended] = useState(false);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(props.isFavourite);
  const { name, rating, description, ratingCount, picturesId } = props.resto;
  const { streetName, streetNumber, postalCode, city, country } = props.resto.location;
  const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pictures, setPictures] = useState<IimageInterface[]>(props.pictures && props.pictures.length > 0 ? props.pictures : []);
  const [loading, setLoading] = useState(props.pictures ? props.pictures.length === 0 : false);

  const handleClick = () => {
    setExtended((prevState) => !prevState);
  }
  const { t } = useTranslation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchImages = async () => {
      setLoading(true);
      try {
        if (props.resto.picturesId.length > 0) {
          const fetchedImages = await getImages(props.resto.picturesId);
          if (isMounted.current) {
            setPictures(fetchedImages);
          }
        }
      } catch {
        if (isMounted.current) {
          setPictures([{
            base64: defaultRestoImage,
            contentType: "image/png",
            filename: "placeholderResto.png",
            size: 0,
            uploadDate: "0",
            id: 0,
          }]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    if (props.pictures && props.pictures.length <= 0) {
      fetchImages();
    }
    return () => {
      isMounted.current = false;
    }
  }, [picturesId]);

  const handleClickInfo = () => {
    navigate(`/menu/${props.resto.uid}`, {
      state: {
        restoName: name,
        restoID: props.resto.uid,
        address: address
      }
    });
  };
  
  const handleShareClick = (event: any) => {
    event.stopPropagation();
    const menuUrl = `${window.location.origin}/menu/${props.resto.uid}`;
    navigator.clipboard.writeText(menuUrl);
    setIsDialogOpen(true);
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
      if (props.deleteFavResto) {
        setIsFavorite(true);
        props.deleteFavResto(props.resto.uid);
      }
    }
  };

  const handleFavoriteKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleFavoriteClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <Paper id="resto-card" key={props.resto.uid + 'card'} className={styles.DishBox} elevation={3} onClick={handleClick}>
      <Grid container>
        <Grid item xs={12} sm={3} className={styles.GridItemImage}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={200} />
          ) : (
            <img
              key={pictures[0].id + name}
              src={pictures[0].base64}
              alt={name}
              className={styles.ImageDimensions}
            />
          )}
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
              key={props.resto.uid + 'fav'}
            >
              {isFavorite ? (
                <FavoriteIcon id="favourite" color="error" />
              ) : (
                <FavoriteBorderIcon id="no-favourite" color="error" />
              )}
            </div>
          </div>
          <div className={styles.FlexParent}>
            <RatingDisplay
              restoRating={rating}
              restoRatingsCount={ratingCount}
              restoName={name}
              restoID={props.resto.uid}
            />
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
                                               pictureBase64={pictures.length > 0 ?
                                                   pictures[0].base64 : defaultRestoImage}
      />}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{t('components.RestoCard.linkCopiedTitle')}</DialogTitle>
        <DialogContent>
          <p>{t('components.RestoCard.linkCopied')}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RestoCard;
