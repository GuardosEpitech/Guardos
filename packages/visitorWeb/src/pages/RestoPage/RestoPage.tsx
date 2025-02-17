import React, {useEffect, useRef, useState} from 'react';
import styles from "@src/pages/RestoPage/RestoPage.module.scss";
import InputSearch from "@src/components/InputSearch/InputSearch";
import Filter from "@src/components/Filter/Filter";
import MapView from '@src/components/Map/Map';
import AdCard from "@src/components/AdCard/AdCard";
import { getNewFilteredRestos } from "@src/services/filterCalls";
import { ISearchCommunication } from "shared/models/communicationInterfaces";
import { IRestaurantFrontEnd } from 'shared/models/restaurantInterfaces';
import RestoCard from "@src/components/RestoCard/RestoCard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import {getRestoFavourites} from "@src/services/favourites";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {getUserAllergens} from "@src/services/userCalls";
import {getCategories} from "@src/services/categorieCalls";
import { getVisitorUserPermission } from '@src/services/permissionsCalls';
import { IimageInterface } from 'shared/models/imageInterface';
import { getImages } from '@src/services/imageCalls';
import { defaultRestoImage } from "shared/assets/placeholderImageBase64";

type Color = "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"

interface Allergen {
  name: string;
  value: boolean;
  colorButton: Color;
}

const Btn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
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

const RestoPage = () => {
  const [inputFieldsOutput, setInputFieldsOutput] = useState('');
  const [inputFields, setInputFields] = useState(['', '']);
  const [userPosition, setUserPosition] = React.useState<{ lat: number; lng: number } | null>(null);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const hasLoadedFilter = useRef(false);
  const [rating, setRating] = useState(0);
  const [rangeValue, setRangeValue] = useState(0);
  const [filteredRestaurants, setFilteredRestaurants] = 
    useState<Array<IRestaurantFrontEnd>>();
  const [allergens, setAllergens] = useState<Allergen[]>([
    { name: "celery", value: false, colorButton: "primary" },
    { name: "gluten", value: false, colorButton: "primary" },
    { name: "crustaceans", value: false, colorButton: "primary" },
    { name: "eggs", value: false, colorButton: "primary" },
    { name: "fish", value: false, colorButton: "primary" },
    { name: "lupin", value: false, colorButton: "primary" },
    { name: "milk", value: false, colorButton: "primary" },
    { name: "molluscs", value: false, colorButton: "primary" },
    { name: "mustard", value: false, colorButton: "primary" },
    { name: "peanuts", value: false, colorButton: "primary" },
    { name: "sesame", value: false, colorButton: "primary" },
    { name: "soybeans", value: false, colorButton: "primary" },
    { name: "sulphites", value: false, colorButton: "primary" },
    { name: "tree nuts", value: false, colorButton: "primary" }
  ]);
  const [isFavouriteRestos, setIsFavouriteRestos] = React.useState<Array<number>>([]);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingAllergens, setLoadingAllergens] = useState(true);
  const [premium, setPremium] = useState<boolean>(false);
  const [restaurantImages, setRestaurantImages] = useState<Record<number, IimageInterface[]>>({});
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchAllImages = async (restaurants: IRestaurantFrontEnd[]) => {
      const imagesMap: Record<number, IimageInterface[]> = {};
      for (const resto of restaurants) {
        if (resto.picturesId && resto.picturesId.length > 0) {
          try {
            imagesMap[resto.uid] = await getImages(resto.picturesId);
          } catch {
            imagesMap[resto.uid] = [{ base64: defaultRestoImage, 
                                      contentType: "image/png", 
                                      filename: "placeholderResto.png",
                                      size: 0,
                                      uploadDate: "0",
                                      id: 0 }];
          }
        } else {
          imagesMap[resto.uid] = [{ base64: defaultRestoImage, 
                                    contentType: "image/png", 
                                    filename: "placeholderResto.png",
                                    size: 0,
                                    uploadDate: "0",
                                    id: 0 }];
        }
      }
      setRestaurantImages(imagesMap);
      setIsImagesLoaded(true);
    };

    if (filteredRestaurants && filteredRestaurants.length > 0) {
      setIsImagesLoaded(false);
      fetchAllImages(filteredRestaurants);
    }
  }, [filteredRestaurants]);

  const clearFilter = () => {
    setInputFields(['', '']);
    setCategories(prevCategories =>
        prevCategories.map(category => ({ ...category, value: false })));
    setRating(0);
    setRangeValue(0);
    setAllergens(prevAllergens =>
        prevAllergens.map(allergen => ({ ...allergen, value: false, colorButton: "primary" })));
    setUserPosition(null);
  };

  const getPremium = async () => {
    try {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }
      const permissions = await getVisitorUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      const isBasicUser = permissions.includes('basicSubscription');
      if (isPremiumUser || isBasicUser) {
        setPremium(true);
      } else {
        setPremium(false);
      }
    } catch (error) {
        console.error("Error getting permissions: ", error);
    }
  };

  useEffect(() => {
    getPremium();
  }, []);

  useEffect(() => {
    localStorage.setItem('freshLogin', 'false');
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    const initializeData = async () => {
      const fetchedCategories = await getCategories(userToken);
      if (!fetchedCategories) {return;}
      const formattedCategories = fetchedCategories.map((category: any) => ({
        name: category,
        value: false,
      }));
      setCategories(formattedCategories);
    };

    const loadAllergensAndFavourites = async () => {
      setLoadingAllergens(true);
      const userAllergens = await getUserAllergens(userToken);

      const updatedAllergens = allergens.map((allergen) => ({
        ...allergen,
        value: userAllergens?.includes(allergen.name) ? true : allergen.value,
      }));
      
      setAllergens(updatedAllergens);

      const newFilter = {
        range: rangeValue,
        rating: [rating, 5],
        name: inputFields[0],
        location: inputFields[1],
        categories: categories.filter(category =>
          category.value).map(category => category.name),
        allergenList: updatedAllergens.filter(allergen =>
          allergen.value).map(allergen => allergen.name),
        userLoc: userPosition
      };

      localStorage.setItem('filter', JSON.stringify(newFilter));
      setLoadingAllergens(false); 
      await fetchFavourites();
    };

    initializeData();

    loadAllergensAndFavourites()
      .then(() => console.log("Loaded allergens and favourites ", allergens))
      .catch((error) => console.error("Error loading allergens or favourites:", error));

    clearFilter(); 
    checkDarkMode();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !hasLoadedFilter.current && !loadingAllergens) {
      hasLoadedFilter.current = true;
      loadFilter().then(r => console.log('Reloaded filter'));
    }
  }, [categories, loadingAllergens]);

  const fetchFavourites = async () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favourites = await getRestoFavourites(userToken);
      const favouriteRestoIds = favourites.map((fav: any) => fav.uid);
      setIsFavouriteRestos(favouriteRestoIds);
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  const insertAdCard = (restaurants: Array<IRestaurantFrontEnd>) => {
    const totalCards = restaurants.length;
    if (totalCards === 0) return restaurants; 
    const randomIndex = Math.floor(Math.random() * (totalCards + 1));
    const combinedCards = [...restaurants];
    combinedCards.splice(randomIndex, 0, { isAd: true } as unknown as IRestaurantFrontEnd);

    return combinedCards;
  };

  const loadFilter = async () => {
    const filter = JSON.parse(localStorage.getItem('filter') || '{}');
    setInputFields([filter.name, filter.location]);
    await handleFilterChange(filter);
  };

  const updateNameLocation = (name: string, location: string) => {
    setInputFields([name, location]);
  }

  const handleFilterChange = async (filter: ISearchCommunication) => {
    let inputFieldOutput = '';
    if (filter.rating && Array.isArray(filter.rating) && filter.rating.length > 0) {
      setRating(filter.rating[0]);
    }
    if (filter.range) setRangeValue(filter.range);
    if ((filter.name && filter.name.length > 0) || (filter.location && filter.location.length > 0)) {
      setInputFields([filter.name, filter.location]);
    }
    setLoading(true);
    const updatedCategories = categories.map((category) => ({
      ...category,
      value: filter.categories ? filter.categories?.includes(category.name) : category.value,
    }));
    setCategories(updatedCategories);

    const updatedAllergens: Allergen[] = allergens.map(allergen => ({
      ...allergen,
      value: filter.allergenList ? filter.allergenList?.includes(allergen.name) : allergen.value,
      colorButton: filter.allergenList && filter.allergenList?.includes(allergen.name) ? "secondary" : "primary"
    }));

    setAllergens(updatedAllergens);
    setInputFieldsOutput('');

    if (filter.name !== '' || filter.location !== '') {
      inputFieldOutput += t('pages.RestoPage.search-query-text');
    }
    if (filter.name !== '') {
      inputFieldOutput += filter.name;
      if (filter.location !== '') {
        inputFieldOutput += '; ';
      }
    }
    if (filter.location !== '') {
      inputFieldOutput += filter.location;
    }
    setInputFieldsOutput(inputFieldOutput);
    const newFilter = {
      range: filter.range ? filter.range : rangeValue,
      rating:
          filter.rating && Array.isArray(filter.rating) && filter.rating.length > 0
              ? [filter.rating[0], 5]
              : [rating, 5],
      name: filter.name,
      location: filter.location,
      categories: updatedCategories
          .filter((category) => category.value)
          .map((category) => category.name),
      allergenList: updatedAllergens
          .filter((allergen) => allergen.value)
          .map((allergen) => allergen.name),
      userLoc: userPosition ? userPosition : filter.userLoc,
    };
    localStorage.setItem('filter', JSON.stringify(newFilter));
    const restos = await getNewFilteredRestos(newFilter);
    if (!premium) {
      setFilteredRestaurants(insertAdCard(restos));
    } else {
      setFilteredRestaurants(restos);
    }
    setLoading(false); 
  };

  const handleButtonClick = async () => {
    await fetchFavourites();
    setStep(prevStep => (prevStep === 1 ? 2 : 1));
  };

  const getFilter = () => {
    return {
      range: rangeValue,
      rating: [rating, 5],
      name: inputFields[0],
      location: inputFields[1],
      categories: categories.filter(category => 
        category.value).map(category => category.name),
      allergenList: allergens.filter(allergen => 
        allergen.value).map(allergen => allergen.name),
      userLoc: userPosition
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newFilter = {
        range: rangeValue,
        rating: [rating, 5],
        name: inputFields[0],
        location: inputFields[1],
        categories: categories.filter(category =>
          category.value).map(category => category.name),
        allergenList: allergens.filter(allergen =>
          allergen.value).map(allergen => allergen.name),
        userLoc: userPosition
      };
      localStorage.setItem('filter', JSON.stringify(newFilter));

      try {
        const restos = await getNewFilteredRestos(newFilter);
        if (!premium) {
          setFilteredRestaurants(insertAdCard(restos));
        } else {
          setFilteredRestaurants(restos);
        }
      } catch (error) {
        console.error("Error fetching filtered restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
      fetchData();
    
  }, [userPosition]);

  return (
    <>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('pages.RestoPage.what-you-looking-for')}</span>
        <InputSearch
          onChange={updateNameLocation} 
          onClick={handleFilterChange} 
        />
      </div>
      <div className={styles.DivContent}>
        <div className={styles.DivMapBtn}>
          <div className={styles.DivRect}>
            <ThemeProvider theme={Btn()}>
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={handleButtonClick}>
                {step === 1 ? 'Map' : 'List'}
              </Button>
            </ThemeProvider>
          </div>
          <Filter
            onChange={handleFilterChange}
            onFilterLoad={loadFilter}
            fetchFilter={getFilter}
            filter={getFilter()}
            categories={categories}
            allergens={allergens}
            onChangeUserPosition={setUserPosition}
          />
        </div>
        {step === 1 ? (
          <div className={styles.DivContentRestoSection}>
            {inputFields[0] === '' && inputFields[1] === '' ? (
              <h1 className={styles.TitleCard}>{t('pages.RestoPage.search-result')}</h1>
            ) : (
              <h1 className={styles.TitleCard}>{inputFieldsOutput}</h1>
            )}
            {filteredRestaurants?.length === 0 ? (
              <h2 style={{ textAlign: "center" }}>{t('pages.RestoPage.noresto')}</h2>
            ) : ( loading ? 
              (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                </Stack>
              ) : (
                !isImagesLoaded ? ( // Check if images are loading
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                  <Skeleton variant="rounded" width={1000} height={130} />
                </Stack>
              ) : (
                filteredRestaurants?.map((item, index) => {
                  if ('isAd' in item) {
                    return <AdCard key={`ad-${index}`} />;
                  }
                  const isFavourite = isFavouriteRestos?.includes(item.uid);
                  return <RestoCard 
                            resto={item} 
                            dataIndex={index} 
                            key={index} 
                            isFavourite={isFavourite} 
                            pictures={restaurantImages[item.uid] || [{
                              base64: defaultRestoImage,
                              contentType: "image/png",
                              filename: "placeholderResto.png",
                              size: 0,
                              uploadDate: "0",
                              id: 0,
                            }]}
                          />
                })
              )
              ))}
          </div>
          ) : (
          <div className={styles.container}>
            <div className={styles.mapContainer}>
              <MapView data={filteredRestaurants} userPosition={userPosition} favRestos={isFavouriteRestos}/>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


export default RestoPage;
