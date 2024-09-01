import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import pic1 from "../../../../shared/assets/menu-pic1.jpg";
import pic2 from "../../../../shared/assets/menu-pic2.jpg";
import pic3 from "../../../../shared/assets/menu-pic3.jpg";
import { getRestosMenu } from "@src/services/menuCalls";
import Accordion from "@src/components/Accordion/Accordion";
import { useTranslation } from "react-i18next";
import { getUserAllergens, getUserDislikedIngredients } from "@src/services/userCalls";
import { checkDarkMode } from "../../utils/DarkMode";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

const MenuPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isFavouriteDishs, setIsFavouriteDishs] = useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [isFavouriteResto, setIsFavouriteResto] = useState(false);
  const [restoMenu, setRestoMenu] = useState<ICategories[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<any[]>([]);
  const [restoName, setRestoName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [menuDesignID, setMenuDesignID] = useState<number>(0);
  const { t } = useTranslation();

  const thirdLayout = {
    backgroundColor: 'rgba(255,126,145,0.5)',
    padding: '40px',
    borderRadius: '10px',
  };

  const fourthLayout = {
    fontFamily: 'Lucida Handwriting, sans-serif'
  };

  useEffect(() => {
    // Extract state from location
    if (location.state) {
      const { restoName: passedName, address: passedAddress } = location.state as { restoName: string; address: string };
      setRestoName(passedName);
      setAddress(passedAddress);
    }

    if (id) {
      fetchMenu();
      fetchFavourites().then(() => console.log("Loaded favourite dish list"));
      fetchFavouriteRestos().then(() => console.log("Checked if resto is favourite."));
    }
    checkDarkMode();
  }, [id, location.state]);

  const fetchMenu = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }
  
    try {
      const userAllergens = await getUserAllergens(userToken);
      const ingredients = await getUserDislikedIngredients(userToken);
      const menuData = await getRestosMenu(Number(id), userAllergens, ingredients);
      setDislikedIngredients(ingredients);
      setRestoMenu(menuData || []);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setRestoMenu([]);
    }
  };

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
      setIsFavouriteResto(favouriteRestoIds.includes(Number(id)));
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (event.type === 'keydown' && (event as React.KeyboardEvent<HTMLDivElement>).key !== 'Enter') {
      return;
    }

    if (event.type === 'click' || (event.type === 'keydown' && (event as React.KeyboardEvent<HTMLDivElement>).key === 'Enter')) {
      event.stopPropagation();
  
      setIsFavouriteResto((prevIsFavorite) => !prevIsFavorite);

      const userToken = localStorage.getItem('user');
      if (userToken === null) { return; }

      if (!isFavouriteResto) {
        await addRestoAsFavourite(userToken, Number(id));
      } else {
        await deleteRestoFromFavourites(userToken, Number(id));
      }
    }
  };

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    sectionRefs.current = restoMenu.map((_, index) => sectionRefs.current[index] ?? React.createRef<HTMLDivElement>().current);
  }, [restoMenu]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.RectOnImg}>
        <List>
          <ListItem>
            <h2 className={styles.RestaurantTitle}>{restoName}</h2>
            <div
              className={styles.FavoriteIcon}
              tabIndex={0}
              onClick={handleFavoriteClick}
              onKeyDown={e => handleFavoriteClick(e as React.KeyboardEvent<HTMLDivElement>)}
              role="button"
              aria-pressed={isFavouriteResto}
            >
              {isFavouriteResto ? (
                <FavoriteIcon id="favourite" color="error" />
              ) : (
                <FavoriteBorderIcon id="no-favourite" color="error" />
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
                        restoID={Number(id)}
                        dishID={dish.uid}
                        discount={dish.discount}
                        validTill={dish.validTill}
                        isFavourite={isFavouriteDishs.some(
                          (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
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
                            dislikedIngredients={dislikedIngredients}
                            dishDescription={dish.description}
                            options={dish.category.extraGroup.join(", ")}
                            price={dish.price}
                            picturesId={dish.picturesId}
                            restoID={Number(id)}
                            dishID={dish.uid}
                            discount={dish.discount}
                            validTill={dish.validTill}
                            isFavourite={isFavouriteDishs.some(
                              (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
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
            {/* Placeholder for other menuDesignID cases */}
          </div>
        )}
        {menuDesignID >= 1 ? (
          <div className={`${styles.secondLayout} ${menuDesignID === 3 ? styles.fancyLayout : ''}`} style={menuDesignID === 2 ? thirdLayout : null}>
            <div className={styles.secondLayoutList}>
              <ul>
                {restoMenu.map((category: ICategories, index: number) => (
                  <li key={index} onClick={() => scrollToSection(index)} className={styles.secondLayoutListObject}>
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.restoList}>
              {restoMenu.map((category: ICategories, index: number) => (
                <div key={index} ref={el => sectionRefs.current[index] = el}>
                  {index % 3 === 0 ? (
                    <div style={{ backgroundImage: `url(${pic1})` }} className={styles.secondLayoutBanner} />
                  ) : index % 3 === 1 ? (
                    <div style={{ backgroundImage: `url(${pic2})` }} className={styles.secondLayoutBanner} />
                  ) : (
                    <div style={{ backgroundImage: `url(${pic3})` }} className={styles.secondLayoutBanner} />
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
                          restoID={Number(id)}
                          dishID={dish.uid}
                          discount={dish.discount}
                          validTill={dish.validTill}
                          isFavourite={isFavouriteDishs.some(
                            (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
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
                              dislikedIngredients={dislikedIngredients}
                              dishDescription={dish.description}
                              options={dish.category.extraGroup.join(", ")}
                              price={dish.price}
                              picturesId={dish.picturesId}
                              restoID={Number(id)}
                              dishID={dish.uid}
                              discount={dish.discount}
                              validTill={dish.validTill}
                              isFavourite={isFavouriteDishs.some(
                                (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
                              )}
                            />
                          ))}
                      </Accordion>
                  </Category>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Placeholder for other menuDesignID cases */}
          </div>
        )}
      </Layout>
    </>
  );
};

export default MenuPage;
