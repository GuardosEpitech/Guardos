import React, { useEffect } from "react";
import styles from "./HomePage.module.scss";
import InputSearch from "@src/components/InputSearch/InputSearch";
import RestoCard from "@src/components/RestoCard/RestoCard";
import MapButton from "@src/components/MapButton/MapButton";
import Filter from "@src/components/Filter/Filter";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import { ISearchCommunication } from "shared/models/communicationInterfaces";
import { getFilteredRestos } from "@src/services/filterCalls";
import {getRestoFavourites} from "@src/services/favourites";

type color = "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"

interface allergen {
  name: string;
  value: boolean;
  colorButton: color;
}

const HomePage = () => {
  // needs to be changed for the database && be sorted out as an own component
  const [inputFields, setInputFields] = React.useState(['', '']);
  const [categories, setCategories] = React.useState([
    { name: "Burger", value: true },
    { name: "Pizza", value: true },
    { name: "Salad", value: true },
    { name: "Sushi", value: true },
    { name: "Pasta", value: true }
  ]);
  const [rating, setRating] = React.useState(3);
  const [rangeValue, setRangeValue] = React.useState(100);
  const [filteredRestaurants, setFilteredRestaurants] = React.useState<Array<IRestaurantFrontEnd>>();
  const [allergens, setAllergens] = React.useState<allergen[]>([
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

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    loadFilter().then(r => console.log("Loaded search data."));
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
    getFilteredRestos(inter).then((res) => {
      setFilteredRestaurants(res);
    });
  }

  const loadFilter = async (loadedFilter?: ISearchCommunication) => {
    let res = '{ name: "" }';
    if (loadedFilter === undefined) {
      res = localStorage.getItem('filter');
      if (res == null || res === '""') {
        updateRestoData();
        return;
      }
    }
    const filter: ISearchCommunication = loadedFilter !== undefined ? loadedFilter : JSON.parse(res);
    if (filter === null || filter === undefined) {
      updateRestoData();
      return;
    }
    if (filter.rating !== undefined) {
      setRating(filter.rating[0]);
    }
    if (filter.range !== undefined) {
      setRangeValue(filter.range);
    }
    if (filter.name !== undefined) {
      setInputFields([filter.name, inputFields[1]]);
    }
    if (filter.location !== undefined) {
      setInputFields([inputFields[0], filter.location]);
    }
    handleResetCategories();
    const categoriesCopy = categories;
    if (filter.categories !== undefined) {
      for (let i = 0; i < filter.categories.length; i++) {
        for (let j = 0; i < categories.length; j++) {
          if (filter.categories[i] === categories[j].name) {
            categoriesCopy[j].value = true;
            break;
          }
        }
      }
      setCategories(categoriesCopy);
    }
    handleResetAllergens();
    const allergensCopy = allergens;
    if (filter.allergenList !== undefined) {
      for (let i = 0; i < filter.allergenList.length; i++) {
        for (let j = 0; j < allergens.length; j++) {
          if (filter.allergenList[i] == allergens[j].name) {
            allergensCopy[j].value = true;
            allergensCopy[j].colorButton = "secondary";
            break;
          }
        }
      }
      setAllergens(allergensCopy);
    }

    setFilteredRestaurants(await getFilteredRestos(filter));
  }

  const getFilter = () => {
    return {
      range: rangeValue,
      rating: [rating, 5],
      name: inputFields[0],
      location: inputFields[1],
      categories: categories.filter(category => category.value).map(category => category.name),
      allergenList: allergens.filter(allergen => allergen.value).map(allergen => allergen.name)
    }
  }

  const handleResetCategories = () => {
    const updatedCategories = categories.map(category => ({
      ...category,
      value: false
    }));

    setCategories(updatedCategories);
  };

  const handleResetAllergens = () => {
    const updatedAllergens = allergens.map(allergen => ({
      ...allergen,
      colorButton: "primary" as color,
      value: false
    }));

    setAllergens(updatedAllergens);
  };

  async function handleFilterChange(obj: ISearchCommunication, check?: any, check2?: any) {
    let location = inputFields[1];
    let nameSearch = inputFields[0];
    let rangeSearch = rangeValue;
    let categoriesCopy = categories;
    let allergensCopy = allergens;

    if (obj.location || obj.name) {
      location = obj.location;
      nameSearch = obj.name;
      setInputFields([obj.name, obj.location]);
    }
    if (obj.range) {
      rangeSearch = obj.range;
      setRangeValue(obj.range);
    }
    if (obj.rating) {
      setRating(obj.rating[0]);
    }
    if (obj.allergenList && obj.categories) {
      setAllergens(check2);
      allergensCopy = check2;
      setCategories(check);
      categoriesCopy = check;
    } else if (obj.allergenList) {
      setAllergens(check);
      allergensCopy = check;
    } else if (obj.categories) {
      setCategories(check);
      categoriesCopy = check;
    }

    const categoriesSelected = [];
    const allergenListChanged = [];

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].value == true) {
        categoriesSelected.push(categoriesCopy[i].name);
      }
    }
    for (let i = 0; i < allergensCopy.length; i++) {
      if (allergensCopy[i].value) {
        allergenListChanged.push(allergensCopy[i].name);
      }
    }

    const inter: ISearchCommunication = {
      range: rangeSearch,
      rating: [rating, 5],
      name: nameSearch,
      location: location,
      categories: categoriesSelected,
      allergenList: allergenListChanged
    }
    localStorage.setItem('filter', JSON.stringify(inter));
    setFilteredRestaurants(await getFilteredRestos(inter));
  }

  // until here -> more dynamic
  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>What are you looking for ?</span>
        <InputSearch onChange={handleFilterChange} />
      </div>
      <div className={styles.DivContent}>
        <div className={styles.DivMapBtn}>
          <MapButton />
          <Filter
            onChange={handleFilterChange}
            onFilterLoad={loadFilter}
            fetchFilter={getFilter}
            filter={getFilter()}
            categories={categories}
            allergens={allergens}
          />
        </div>
        <div>
          <h1 className={styles.TitleCard}>Berlin - +12548 Restaurants</h1>
          {filteredRestaurants?.map((item, index) => {
            const isFavourite = isFavouriteRestos.includes(item.uid);
            return <RestoCard resto={item} dataIndex={index} key={index} isFavourite={isFavourite} />
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
