import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import styles from "@src/pages/MenuPage/MenuPage.module.scss";
import Dish from "@src/components/menu/Dish/Dish";
import Category from "shared/components/menu/Category/Category";
import Layout from "shared/components/Layout/Layout";
import PlaceIcon from "@mui/icons-material/Place";
import { List, ListItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ICategories } from "shared/models/categoryInterfaces";
import { IDishFE } from "shared/models/dishInterfaces";
import {
  addRestoAsFavourite,
  deleteRestoFromFavourites,
  getDishFavourites,
  getRestoFavourites
} from "@src/services/favourites";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

const MenuPage = () => {
  const { menu, restoName, restoID, address } = useLocation().state;
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [isFavouriteResto, setIsFavouriteResto] = React.useState(false);

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
    fetchFavouriteRestos().then(r => console.log("Checked if resto is favourite."));
  }, [])

  const fetchFavourites = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favouriteDishIds = await getDishFavourites(userToken);
      setIsFavouriteDishs(favouriteDishIds);
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  const fetchFavouriteRestos = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favourites = await getRestoFavourites(userToken);
      const favouriteRestoIds = favourites.map((fav: any) => fav.uid);
      setIsFavouriteResto(favouriteRestoIds.includes(restoID));
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the card click event from triggering

    // Toggle the favorite status
    setIsFavouriteResto((prevIsFavorite) => !prevIsFavorite);

    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    if (!isFavouriteResto) {
      await addRestoAsFavourite(userToken, restoID);
    } else {
      await deleteRestoFromFavourites(userToken, restoID);
    }
  };

  return (
    <>
      <div className={styles.RectOnImg}>
        <List>
          <ListItem>
            <h2 className={styles.RestaurantTitle}>{restoName}</h2>
            <div className={styles.FavoriteIcon} onClick={handleFavoriteClick}>
              {isFavouriteResto ? (
                <FavoriteIcon id="favourite-resto" color="error" />
              ) : (
                <FavoriteBorderIcon id="no-favourite-resto" color="error" />
              )}
            </div>
          </ListItem>
          <ListItem>
            <div className={styles.Address}>
              <ThemeProvider theme={theme}>
                <PlaceIcon color="primary" />
              </ThemeProvider>
              <span className={styles.RestaurantAddress}>{address}</span>
            </div>
          </ListItem>
        </List>
      </div>
      <Layout>
        {menu.map((category: ICategories, index: number) => {
          return (
            <>
              {category.dishes.length > 0 &&
                <Category key={category.name + index} title={category.name}>
                  {category.dishes.map((dish: IDishFE, index: number) => {
                    const isFavourite = isFavouriteDishs.some(fav => {
                      return fav.restoID === restoID && fav.dish.uid === dish.uid;
                    });
                    return (
                      <Dish
                        key={dish.name + index}
                        dishName={dish.name}
                        dishAllergens={dish.allergens}
                        dishDescription={dish.description}
                        options={dish.category.extraGroup.join(", ")}
                        price={dish.price}
                        picturesId={dish.picturesId}
                        restoID={restoID}
                        dishID={dish.uid}
                        isFavourite={isFavourite}
                      />
                    )
                  })}
                </Category>}
            </>
          )
        })}
      </Layout>
    </>
  );
};

export default MenuPage;
