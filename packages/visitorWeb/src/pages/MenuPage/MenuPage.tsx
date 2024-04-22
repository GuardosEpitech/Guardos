import React from "react";
import { useParams } from "react-router-dom";
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
import { getRestaurant } from "@src/services/restoCall";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

const MenuPage = () => {
  const { name } = useParams();
  const [categories, setCategories] =  React.useState([]); // Initialize categories state
  const [restoID, setRestoID] =  React.useState(null); // Initialize restoID state
  const [address1, setAddress1] =  React.useState(null); // Initialize address state
  // const { streetName, streetNumber, postalCode, city, country } = address1;
  // const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [isFavouriteResto, setIsFavouriteResto] = React.useState(false);

  React.useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
    fetchFavouriteRestos().then(r => console.log("Checked if resto is favourite."));
    const fetchData = async () => {
      try {
        const resto = await getRestaurant(name); // Assuming getRestaurant is an async function that fetches restaurant data
        setCategories(resto.categories);
        setRestoID(resto.uid);
        setAddress1(resto.location);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchData();
  }, [name])
  const address = address1 ? `${address1.streetName} ${address1.streetNumber}, ${address1.postalCode} ${address1.city}, ${address1.country}` : "";

  
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
            <h2 className={styles.RestaurantTitle}>{name}</h2>
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
        {categories.map((category: ICategories, index: number) => {
          return (
            <React.Fragment key={category.name + index}>
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
            </React.Fragment>
          )
        })}
      </Layout>
    </>
  );
};

export default MenuPage;
function useState(arg0: undefined[]): [any, any] {
  throw new Error("Function not implemented.");
}

