import React, { useEffect, useState } from 'react';
import styles from "@src/pages/RestoPage/RestoPage.module.scss";
import InputSearch from "@src/components/InputSearch/InputSearch";
import Filter from "@src/components/Filter/Filter";
import MapView from '@src/components/Map/Map';
import { getNewFilteredRestos } from "@src/services/filterCalls";
import { ISearchCommunication } from "shared/models/communicationInterfaces";
import { IRestaurantFrontEnd } from 'shared/models/restaurantInterfaces';
import RestoCard from "@src/components/RestoCard/RestoCard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import {getRestoFavourites} from "@src/services/favourites";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";
import { getCurrentCoords } from '@src/services/mapCalls';

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
  const [inputFields, setInputFields] = useState(['', '']);
  const [userPosition, setUserPosition] = React.useState<{ lat: number; lng: number } | null>(null); 
  const [address, setAddress] = React.useState('');
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([
    // TODO: apply i18n
    { name: "Burger", value: false },
    { name: "Pizza", value: false },
    { name: "Salad", value: false },
    { name: "Sushi", value: false },
    { name: "Pasta", value: false }
  ]);
  const [rating, setRating] = useState(0);
  const [rangeValue, setRangeValue] = useState(0);
  const [filteredRestaurants, setFilteredRestaurants] = 
    useState<Array<IRestaurantFrontEnd>>();
  const [allergens, setAllergens] = useState<Allergen[]>([
    // TODO: apply i18n
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
    { name: "sulphides", value: false, colorButton: "primary" },
    { name: "tree nuts", value: false, colorButton: "primary" }
  ]);
  const [isFavouriteRestos, setIsFavouriteRestos] = React.useState<Array<number>>([]);
  const {t} = useTranslation();

  const clearFilter = () => {
    setInputFields(['', '']);
    setCategories(categories.map(category => ({ ...category, value: false })));
    setRating(0);
    setRangeValue(0);
    setAllergens(allergens.map(allergen => 
      ({ ...allergen, value: false, colorButton: "primary" })));
  };

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    clearFilter(); 
    loadFilter().then(() => console.log("Loaded search data."));
    checkDarkMode();
  }, []);

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

  const updateRestoData = () => {
    const inter: ISearchCommunication = { name: "" }
    getNewFilteredRestos(inter).then((res) => {
      setFilteredRestaurants(res);
    });
  }

  const loadFilter = async () => {
    const filter = JSON.parse(localStorage.getItem('filter') || '{}');
    await handleFilterChange(filter);
  };

  const updateNameLocation = (name: string, location: string) => {
    setInputFields([name, location]);
  }

  const handleFilterChange = async (filter: ISearchCommunication) => {
    if (filter.range) setRangeValue(filter.range);
    if (filter.rating) setRating(filter.rating[0]);

    const updatedCategories = categories.map(category => ({
      ...category,
      value: filter.categories ? filter.categories
        .includes(category.name) : category.value
    }));

    const updatedAllergens: Allergen[] = allergens.map(allergen => ({
      ...allergen,
      value: filter.allergenList ? filter.allergenList
        .includes(allergen.name) : allergen.value,
      colorButton: filter.allergenList && filter.allergenList
        .includes(allergen.name) ? "secondary" : "primary"
    }));

    setCategories(updatedCategories);
    setAllergens(updatedAllergens);

    const newFilter = {
      range: rangeValue,
      rating: [rating, 5],
      name: inputFields[0],
      location: inputFields[1],
      categories: updatedCategories.filter(category => 
        category.value).map(category => category.name),
      allergenList: updatedAllergens.filter(allergen => 
        allergen.value).map(allergen => allergen.name)
    };

    localStorage.setItem('filter', JSON.stringify(newFilter));
    setFilteredRestaurants(await getNewFilteredRestos(newFilter));
  };

  const handleButtonClick = () => {
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
        allergen.value).map(allergen => allergen.name)
    }
  }

  const handleAddressSearch = async () => {
    try {
      const coords = await getCurrentCoords(address);
      if (coords) {
        const { lat, lng } = coords;
        setUserPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
      } else {
        alert(t('pages.RestoPage.noAddress'));
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      alert('Error fetching address data');
    }
  };

  return (
    <>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('pages.RestoPage.what-you-looking-for')}</span>
        <InputSearch onChange={updateNameLocation} onClick={handleFilterChange} />
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
          />
        </div>
        {step === 1 ? (
          <div className={styles.DivContentRestoSection}>
            <h1 className={styles.TitleCard}>{t('pages.RestoPage.search-result')}</h1>
            {filteredRestaurants?.length === 0 ? (
              <h2>{t('pages.RestoPage.noresto')}</h2>
            ) : (
              filteredRestaurants?.map((item, index) => {
                const isFavourite = isFavouriteRestos.includes(item.uid);
                return <RestoCard resto={item} dataIndex={index} key={index} isFavourite={isFavourite} />
              })
            )}
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.addressInputContainer}>
              <input
                type="text"
                className={styles.addressInput}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('pages.RestoPage.address')}
              />
              <button
                className={styles.addressButton}
                onClick={handleAddressSearch}
              >
                {t('pages.RestoPage.loc')}
               </button>
            </div>
            <div className={styles.mapContainer}>
              <MapView data={filteredRestaurants} userPosition={userPosition}/>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RestoPage;
