import React, { useEffect, useRef } from "react";
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

import { enable, disable, setFetchMethod} from "darkreader";
import pic1 from "../../../../shared/assets/menu-pic1.jpg";
import pic2 from "../../../../shared/assets/menu-pic2.jpg";
import pic3 from "../../../../shared/assets/menu-pic3.jpg";
import {getRestosMenu} from "@src/services/menuCalls";
import Accordion from "@src/components/Accordion/Accordion";
import {useTranslation} from "react-i18next";
import {getUserAllergens} from "@src/services/userCalls";
import {checkDarkMode} from "../../utils/DarkMode";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

const MenuPage = () => {
  const { menu, restoName, restoID, address, menuDesignID } = useLocation().state;
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [isFavouriteResto, setIsFavouriteResto] = React.useState(false);
  const thirdLayout = {
    backgroundColor: 'rgba(255,126,145,0.5)',
    padding: '40px',
    borderRadius: '10px',
  }
  const fourthLayout = {
    fontFamily: 'Lucida Handwriting, sans-serif'
  }
  const [restoMenu, setRestoMenu] = React.useState(menu);
  const {t} = useTranslation();

  useEffect(() => {
    fetchMenu();
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
    fetchFavouriteRestos().then(r => console.log("Checked if resto is favourite."));
    checkDarkMode();
  }, [])

  const fetchMenu = async () => {
    const filter = JSON.parse(localStorage.getItem('filter') || '{}');
    const allergenList = filter.allergenList;
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    if (allergenList.size > 0) {
      setRestoMenu(await getRestosMenu(restoID, allergenList));
    } else {
      const userAllergens = await getUserAllergens(userToken);
      setRestoMenu(await getRestosMenu(restoID, userAllergens));
    }
  }

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

  // Create refs for each section
  const sectionRefs = useRef(restoMenu.map(() => React.createRef()));

  // Function to scroll to a section
  const scrollToSection = (index:number) => {
    sectionRefs.current[index].current.scrollIntoView({ behavior: 'smooth' });
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
        {menuDesignID === 0 ? (
          <div>
            {restoMenu.map((category: ICategories, index: number) => (
              <div key={category.name + index}>
                <Category title={category.name}>
                  {category.dishes
                    .filter((dish: IDishFE) => dish.fitsPreference)
                    .map((dish: IDishFE, dishIndex: number) => (
                      <Dish
                        key={dish.name + dishIndex}
                        dishName={dish.name}
                        dishAllergens={dish.allergens}
                        dishDescription={dish.description}
                        options={dish.category.extraGroup.join(", ")}
                        price={dish.price}
                        picturesId={dish.picturesId}
                        restoID={restoID}
                        dishID={dish.uid}
                        isFavourite={isFavouriteDishs.some(
                          (fav) => fav.restoID === restoID && fav.dish.uid === dish.uid
                        )}
                      />
                    ))}
                    <Accordion title={t('pages.MenuPage.show-non-compatible-dishes')}>
                      {category.dishes
                        .filter((dish: IDishFE) => !dish.fitsPreference)
                        .map((dish: IDishFE, dishIndex: number) => (
                          <Dish
                            key={dish.name + dishIndex}
                            dishName={dish.name}
                            dishAllergens={dish.allergens}
                            dishDescription={dish.description}
                            options={dish.category.extraGroup.join(", ")}
                            price={dish.price}
                            picturesId={dish.picturesId}
                            restoID={restoID}
                            dishID={dish.uid}
                            isFavourite={isFavouriteDishs.some(
                              (fav) => fav.restoID === restoID && fav.dish.uid === dish.uid
                            )}
                          />
                        ))}
                    </Accordion>
                </Category>
              </div>
            ))}
          </div>
        ) : (
          <div>

          </div>
        )}
        {menuDesignID >= 1 ? (
          <div className={`${styles.secondLayout} ${menuDesignID === 3 ? styles.fancyLayout : ''}`} style={menuDesignID === 2 ? thirdLayout : null}>
            <div className={styles.secondLayoutList}>
              <ul>
                {restoMenu.map((category: ICategories, index: number) => {
                  return (
                    <li key={index} onClick={() => scrollToSection(index)} className={styles.secondLayoutListObject}>
                      {category.name}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className={styles.restoList}>
              {restoMenu.map((category: ICategories, index: number) => {
                return (
                  <div key={index} ref={sectionRefs.current[index]}>
                    {index % 3 === 0 ? (
                      <div style={{
                        backgroundImage: `url(${pic1})`
                      }} className={styles.secondLayoutBanner} />
                    ) : (
                      <div/>
                    )}
                    {index % 3 === 1 ? (
                      <div style={{
                        backgroundImage: `url(${pic2})`
                      }} className={styles.secondLayoutBanner} />
                    ) : (
                      <div/>
                    )}
                    {index % 3 === 2 ? (
                      <div style={{
                        backgroundImage: `url(${pic3})`
                      }} className={styles.secondLayoutBanner}/>
                    ) : (
                      <div/>
                    )}

                    <Category title={category.name}>
                      {category.dishes
                        .filter((dish: IDishFE) => dish.fitsPreference)
                        .map((dish: IDishFE, dishIndex: number) => (
                          <Dish
                            key={dish.name + dishIndex}
                            dishName={dish.name}
                            dishAllergens={dish.allergens}
                            dishDescription={dish.description}
                            options={dish.category.extraGroup.join(", ")}
                            price={dish.price}
                            picturesId={dish.picturesId}
                            restoID={restoID}
                            dishID={dish.uid}
                            isFavourite={isFavouriteDishs.some(
                              (fav) => fav.restoID === restoID && fav.dish.uid === dish.uid
                            )}
                          />
                        ))}
                        <Accordion title={t('pages.MenuPage.show-non-compatible-dishes')}>
                          {category.dishes
                            .filter((dish: IDishFE) => !dish.fitsPreference)
                            .map((dish: IDishFE, dishIndex: number) => (
                              <Dish
                                key={dish.name + dishIndex}
                                dishName={dish.name}
                                dishAllergens={dish.allergens}
                                dishDescription={dish.description}
                                options={dish.category.extraGroup.join(", ")}
                                price={dish.price}
                                picturesId={dish.picturesId}
                                restoID={restoID}
                                dishID={dish.uid}
                                isFavourite={isFavouriteDishs.some(
                                  (fav) => fav.restoID === restoID && fav.dish.uid === dish.uid
                                )}
                              />
                            ))}
                        </Accordion>
                    </Category>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div>

          </div>
        )}
      </Layout>
    </>
  );
};

export default MenuPage;
