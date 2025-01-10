import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "@src/pages/MenuPage/MenuPage.module.scss";
import Dish from "@src/components/menu/Dish/Dish";
import Category from "shared/components/menu/Category/Category";
import Layout from "shared/components/Layout/Layout";
import PlaceIcon from "@mui/icons-material/Place";
import {List, ListItem} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ICategories } from "shared/models/categoryInterfaces";
import { IDishFE } from "shared/models/dishInterfaces";
import { AllergenProfile } from "shared/models/restaurantInterfaces";
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
import { getRestosMenu, getRestaurantDetails } from "@src/services/menuCalls";
import Accordion from "@src/components/Accordion/Accordion";
import { useTranslation } from "react-i18next";
import { getUserAllergens, getUserDislikedIngredients } from "@src/services/userCalls";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import { log } from "console";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

const components = createTheme({
  palette: {
    primary: {
      main: "#AC2A37",
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#AC2A37'
          }
        },
      }
    },
  },
})

const MenuPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isFavouriteDishs, setIsFavouriteDishs] = useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [isFavouriteResto, setIsFavouriteResto] = useState(false);
  const [restoMenu, setRestoMenu] = useState<ICategories[][]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<any[]>([]);
  const [restoName, setRestoName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [menuDesignID, setMenuDesignID] = useState<number>(0);
  const [groupProfiles, setGroupProfiles] = useState<AllergenProfile[]>([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const { t } = useTranslation();
  const userProfileName = t('common.me');
  const [loading, setLoading] = useState(true);

  const thirdLayout = {
    backgroundColor: 'rgba(255,126,145,0.5)',
    padding: '40px',
    borderRadius: '10px',
  };

  const fourthLayout = {
    fontFamily: 'Lucida Handwriting, sans-serif'
  };

  useEffect(() => {
    let profiles: AllergenProfile[] = [];
    // Extract state from location
    if (location.state) {
      const { restoName: passedName, address: passedAddress, menuDesignID: passedMenuDesignID } = location.state as {
        restoName: string;
        address: string;
        menuDesignID: number;
      };
      setRestoName(passedName);
      setAddress(passedAddress);
      setMenuDesignID(passedMenuDesignID);

      profiles = JSON.parse(localStorage.getItem('groupProfiles') || '[]');

      if (profiles.length > 0) {
        setGroupProfiles(profiles);
      } else {
        const userToken = localStorage.getItem('user');
        if (userToken === null) {
          return;
        }
        getUserAllergens(userToken).then((userAllergens) => {
          setGroupProfiles([{name: userProfileName, allergens: userAllergens}]);
          profiles = [{name: userProfileName, allergens: userAllergens}];
        });
      }
    } else {
      const restaurantDetails = getRestaurantDetails(Number(id));
      restaurantDetails.then(([name, location]) => {
      const formattedLocation = formatLocation(location);
      setRestoName(name);
      setAddress(formattedLocation);
      }).catch((error) => {
        console.error("Error fetching restaurant details:", error);
      });
      profiles = JSON.parse(localStorage.getItem('groupProfiles') || '[]');

      if (profiles.length > 0) {
        setGroupProfiles(profiles);
      } else {
        const userToken = localStorage.getItem('user');
        if (userToken === null) {
          return;
        }
        getUserAllergens(userToken).then((userAllergens) => {
          setGroupProfiles([{name: userProfileName, allergens: userAllergens}]);
          profiles = [{name: userProfileName, allergens: userAllergens}];
        });
      }
    }

    if (id) {
      fetchMenu(profiles).then(() => console.log("Loaded menu data."));
      fetchFavourites().then(() => console.log("Loaded favourite dish list"));
      fetchFavouriteRestos().then(() => console.log("Checked if resto is favourite."));
    }
  }, [id, location.state]);

  const formatLocation = (location: any) => {
    const { streetName, streetNumber, postalCode, city, country } = location;
    return `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  };

  const getCurrentMenu = () => {
    if (!restoMenu || restoMenu?.length <= selectedProfileIndex) {
      return [];
    }
    return restoMenu[selectedProfileIndex] ?? [];
  }

  const fetchMenu = async (profiles: AllergenProfile[]) => {
    const userToken = localStorage.getItem('user');
    setLoading(true)
    if (userToken === null) {
      return;
    }
    const menuData = [];

    try {
      const ingredients = await getUserDislikedIngredients(userToken);
      for (let i = 0; i < profiles.length; i++) {
        const profileAllergens = profiles[i].allergens.map((allergen) => {
          if (allergen.value) return allergen.name;
        }).filter((allergen) => allergen !== undefined);
        const profileMenu = await getRestosMenu(Number(id), profileAllergens, i == 0 ? ingredients : []);
        const filteredProfileMenu = profileMenu.filter((category: ICategories) => category.dishes.length > 0);
        menuData.push(filteredProfileMenu);
      }
      setDislikedIngredients(ingredients);
      setRestoMenu(menuData);
      return menuData;
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setRestoMenu([]);
      setLoading(false);
      return menuData;
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
    // Ensure the length of refs matches the menu categories
    sectionRefs.current = Array(getCurrentMenu().length)
      .fill(null)
      .map((_, index) => sectionRefs.current[index] || null);
  }, [restoMenu, selectedProfileIndex]);

  const scrollToSection = (index: number) => {
    const targetSection = sectionRefs.current[index];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleProfileChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedProfileIndex(newValue);
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
        <ThemeProvider theme={components}>
          <TabContext value={String(selectedProfileIndex) ?? "0"}>
            <TabList onChange={handleProfileChange} variant={"scrollable"} aria-label="Allergen profiles">
              {groupProfiles.map((profile, index) => (
                <Tab key={index} label={profile.name} value={String(index)} />
              ))}
            </TabList>
            {groupProfiles.map((profile, index) => (
              <TabPanel style={{padding: 0, paddingTop: 24}} key={index} value={String(index)}>
                <div>
                  {menuDesignID === 0 ? (
                    <div>
                      {getCurrentMenu().length > 0 ? getCurrentMenu().map((category: ICategories, index: number) => (
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
                                  combo={dish.combo}
                                  isTopLevel={true}
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
                                    dislikedIngredients={selectedProfileIndex === 0 ? dislikedIngredients : []}
                                    dishDescription={dish.description}
                                    options={dish.category.extraGroup.join(", ")}
                                    price={dish.price}
                                    picturesId={dish.picturesId}
                                    restoID={Number(id)}
                                    dishID={dish.uid}
                                    discount={dish.discount}
                                    validTill={dish.validTill}
                                    combo={dish.combo}
                                    isTopLevel={true}
                                    isFavourite={isFavouriteDishs.some(
                                      (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
                                    )}
                                  />
                                ))}
                            </Accordion>
                          </Category>
                        </div>
                      )) : (
                        <div>
                          <h2>{t('pages.MenuPage.no-menu')}</h2>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`${styles.secondLayout} ${menuDesignID === 3 ? styles.fancyLayout : ''}`} style={menuDesignID === 2 ? thirdLayout : null}>
                      {getCurrentMenu().length > 0 ? (
                        <>
                          <div className={styles.secondLayoutList}>
                            <ul>
                              {getCurrentMenu().map((category: ICategories, index: number) => (
                                <li key={index} onClick={() => scrollToSection(index)} className={styles.secondLayoutListObject}>
                                  {category.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.restoList}>
                            {getCurrentMenu().length > 0 ? getCurrentMenu().map((category: ICategories, index: number) => {
                              return (//@ts-ignore
                                <div key={index} ref={(el) => (sectionRefs.current[index] = el)}>
                                  {index % 3 === 0 ? (
                                    <div
                                      style={{ backgroundImage: `url(${pic1})` }}
                                      className={styles.secondLayoutBanner}
                                    />
                                  ) : index % 3 === 1 ? (
                                    <div
                                      style={{ backgroundImage: `url(${pic2})` }}
                                      className={styles.secondLayoutBanner}
                                    />
                                  ) : (
                                    <div
                                      style={{ backgroundImage: `url(${pic3})` }}
                                      className={styles.secondLayoutBanner}
                                    />
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
                                          combo={dish.combo}
                                          isTopLevel={true}
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
                                            dislikedIngredients={selectedProfileIndex === 0 ? dislikedIngredients : []}
                                            dishDescription={dish.description}
                                            options={dish.category.extraGroup.join(", ")}
                                            price={dish.price}
                                            picturesId={dish.picturesId}
                                            restoID={Number(id)}
                                            dishID={dish.uid}
                                            discount={dish.discount}
                                            validTill={dish.validTill}
                                            combo={dish.combo}
                                            isTopLevel={true}
                                            isFavourite={isFavouriteDishs.some(
                                              (fav) => fav.restoID === Number(id) && fav.dish.uid === dish.uid
                                            )}
                                          />
                                        ))}
                                    </Accordion>
                                  </Category>
                                </div>
                              )
                            }) : (
                              <div>
                                <h2>{t('pages.MenuPage.no-menu')}</h2>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>
                          <h2>{t('pages.MenuPage.no-menu')}</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabPanel>
            ))}
          </TabContext>
        </ThemeProvider>
      </Layout>
    </>
  );
};

export default MenuPage;
