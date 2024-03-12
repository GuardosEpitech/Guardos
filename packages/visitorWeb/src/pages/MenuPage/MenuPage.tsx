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
import {getDishFavourites} from "@src/services/favourites";

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

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
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

  return (
    <>
      <div className={styles.RectOnImg}>
        <List>
          <ListItem>
            <h2 className={styles.RestaurantTitle}>{restoName}</h2>
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
