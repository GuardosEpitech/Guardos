import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { IimageInterface } from "shared/models/imageInterface";

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {getProductsByUser} from "@src/services/productCalls";
import {addNewDish, editDish} from "@src/services/dishCalls";
import {IProduct, IRestaurantFrontEnd}
  from "shared/models/restaurantInterfaces";
import {IAddDish, IDishFE} from "shared/models/dishInterfaces";
import { ICategories } from "shared/models/categoryInterfaces";
import {getAllRestaurantsByUser, getAllRestaurantChainsByUser} from "@src/services/restoCalls";
import {NavigateTo} from "@src/utils/NavigateTo";
import styles from "@src/components/forms/DishForm/DishForm.module.scss";
import {addImageDish, deleteImageDish, getImages}
  from "@src/services/callImages";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {defaultDishImage, defaultRestoImage}
  from 'shared/assets/placeholderImageBase64';
import {useTranslation} from "react-i18next";

const PageBtn = () => {
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
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5
    }
  });
};

interface IDishFormProps {
  dishName?: string;
  dishUID: number;
  dishProducts?: string[];
  dishDescription?: string;
  imageSrc?: string;
  price?: number;
  add?: boolean;
  selectCategory?: string[];
  selectAllergene?: string[];
  restoName?: string[];
  picturesId?: number[];
  discount?: number;
  validTill?: string;
  combo?: number[];
}

// TODO: on creation of dish, add dish image and send it to backend
const DishForm = (props: IDishFormProps) => {
  const navigate = useNavigate();
  const [dish, setDish] = useState<string>(props.dishName || "");
  const [dishPrice, setDishPrice] =
      useState<string>(props.price?.toString() || "");
  const [dishProd, setDishProd] = useState<string[]>(props.dishProducts || []);
  const [dishCategory, setDishCategory] =
      useState<string[]>(props.selectCategory || []);
  const [dishResto, setDishResto] = useState<string[]>(props.restoName || []);
  const [restoChains, setRestoChains] = useState<{uid: number, name: string}[]>([]);
  const [selectedRestoChainId, setSelectedRestoChainId] = useState(0);
  const [valueRestoChain, setValueRestoChain] = useState(null);
  const [inputValueRestoChain, setInputValueRestoChain] = React.useState("");
  const [invalidDishname, setInvalidDishname] = useState<boolean>(false);
  const [invalidPrice, setInvalidPrice] = useState<boolean>(false);
  const [invalidResto, setInvalidResto] = useState<boolean>(false);
  const [invalidProducts, setInvalidProducts] = useState<boolean>(false);
  const [invalidCategory, setInvalidCategory] = useState<boolean>(false);
  const [dishDescription, setDishDescription] =
      useState(props.dishDescription || "");
  const [selectAllergene, setSelectAllergene] =
      useState<string[]>(props.selectAllergene || []);
  const [productListTest, setProductListTest] = useState<Array<string>>([]);
  const [restoList, setRestoList] = useState<Array<string>>([]);
  let allRestoNames: string[] = [];
  let allDishProd: string[] = [];
  // TODO: apply i18n
  const [suggestions, setSuggestions] = useState<string[]>(props.selectCategory || []);
  const suggestionsAller: string[] = ["No Allergens", "Celery", "Gluten",
    "Crustaceans", "Eggs", "Fish", "Lupin", "Milk", "Molluscs", "Mustard",
    "Nuts", "Peanuts", "Sesame seeds", "Soya", "Sulphur dioxide", "Lactose"];
  const dishList: IDishFE[] = [];
  const picturesId: number[] = props.picturesId || [];
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [categories, setCategories] = useState<{ name: string; categories: string[]; }[]>([]);

  const {t} = useTranslation();

  useEffect(() => {
    const userToken = localStorage.getItem('user');
    getProductsByUser(userToken)
      .then((res) => {
        allDishProd = res.map((item: IProduct) => item.name);
        setProductListTest(allDishProd);
      });
  }, []);

  useEffect(() => {
    const updateSuggestions = () => {
      const selectedCategories = categories
        .filter(resto => dishResto.includes(resto.name))
        .flatMap(resto => resto.categories);
      const uniqueCategories = Array.from(new Set(selectedCategories.map(cat => cat.toLowerCase())))
        .map(cat => selectedCategories.find(item => item.toLowerCase() === cat));
      setSuggestions(uniqueCategories);
    };
    if (dishResto.length > 0) {
      updateSuggestions();
    }
  }, [dishResto, categories]);

  useEffect(() => {
    const userToken = localStorage.getItem('user');
    getAllRestaurantsByUser({ key: userToken })
      .then((res) => {
        allRestoNames = res.map((item: IRestaurantFrontEnd) => item.name);
        setRestoList(allRestoNames);
        const mappedCategories = res.map((restaurant: IRestaurantFrontEnd) => ({
          name: restaurant.name,
          categories: restaurant.categories.map((cat: ICategories) => cat.name)
        }));
        setCategories(mappedCategories);
      });
    getAllRestaurantChainsByUser(userToken)
      .then((res) => {
        setRestoChains(res);
      });
  }, []);

  function validateRequiredFields() {
    let invalidFields = false;
    if (dish === undefined || dish === "") {
      setInvalidDishname(true);
      invalidFields = true;
    }
    if (dishProd === undefined || dishProd.length === 0) {
      setInvalidProducts(true);
      invalidFields = true;
    }
    if (dishPrice === undefined || dishPrice === "") {
      setInvalidPrice(true);
      invalidFields = true;
    }
    if (dishCategory === undefined || dishCategory.length === 0) {
      setInvalidCategory(true);
      invalidFields = true;
    }
    if (dishResto === undefined || dishResto.length === 0) {
      setInvalidResto(true);
      invalidFields = true;
    }

    return !invalidFields;
  }

  async function sendRequestAndGoBack() {
    setInvalidDishname(false);
    setInvalidPrice(false);
    setInvalidResto(false);
    setInvalidProducts(false);
    setInvalidCategory(false);
    if (!validateRequiredFields()) {
      return;
    }
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
      return;
    }
    for (let i = 0; i < dishResto.length; i++) {
      dishList[i] = {
        name: dish,
        uid: props.dishUID,
        description: dishDescription,
        price: parseFloat(parseFloat(dishPrice)
          .toFixed(2)),
        products: dishProd,
        allergens: selectAllergene,
        category: {
          foodGroup: dishCategory[0],
          extraGroup: [],
          menuGroup: dishCategory[0]
        },
        resto: dishResto[i],
        discount: props.discount ? props.discount : -1,
        validTill: props.validTill ? props.validTill : "",
        combo: props.combo ? props.combo : []
      };
    }

    if (props.add) {
      for (let i = 0; i < dishList.length; i++) {
        const data: IAddDish = {
          resto: dishList[i].resto,
          dish: dishList[i],
          restoChainID: selectedRestoChainId
        };
        await addNewDish(data, userToken);
      }
    } else {
      for (let i = 0; i < dishList.length; i++) {
        await editDish(dishList[i].resto, dishList[i], userToken);
      }
    }
    return NavigateTo("/dishes", navigate, {successfulForm: true});
  }

  useEffect(() => {
    const loadImages = async () => {
      if (picturesId.length > 0) {
        try {
          const answer = await getImages(picturesId);
          //@ts-ignore
          setPictures(answer.map((img) => ({
            base64: img.base64,
            contentType: img.contentType,
            filename: img.filename,
            size: img.size,
            uploadDate: img.uploadDate,
            id: img.id,
          })));
        } catch (error) {
          console.error("Failed to load images", error);
          setPictures([{
            base64: defaultDishImage,
            contentType: "image/png",
            filename: "placeholder.png",
            size: 0,
            uploadDate: "",
            id: 0,
          }]);
        }
      } else {
        setPictures([{
          base64: defaultDishImage,
          contentType: "image/png",
          filename: "placeholder.png",
          size: 0,
          uploadDate: "",
          id: 0,
        }]);
      }
    };

    loadImages();
  }, [picturesId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = convertImageToBase64(file);
      base64.then((result) => {
        for (let i = 0; i < dishResto.length; i++) {
          if (dishResto[i].length !== 0) {
            addImageDish(dishResto[i], dish, file.name,
              file.type, file.size, result)
              .then(r => {
                setPictures([{ base64: result, contentType: file.type,
                  filename: file.name, size: file.size,
                  uploadDate: "0", id: r }]);
                if (picturesId.length > 0) {
                  deleteImageDish(picturesId[0], dishResto[i], dish);
                  picturesId.shift();
                }
                picturesId.push(r);
              });
          }
        }
      });
    }
  };

  function handeFileDelete() {
    if (picturesId.length > 0) {
      deleteImageDish(picturesId[0], dishResto[0], dish);
      displayImageFromBase64(defaultDishImage, "DishImg");
      setPictures([{
        base64: defaultDishImage,
        contentType: "png",
        filename: "placeholderResto.png",
        size: 0,
        uploadDate: "0",
        id: 0,
      }]);
    }
    else {
      console.log("No image to delete");
    }
  }

  const handleRestoChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setDishResto(value);
    const selectedCategories = categories
      .filter(resto => value.includes(resto.name))
      .flatMap(resto => resto.categories);
    const filteredCategories = selectedCategories.filter((item, index, self) =>
      index === self.findIndex((t) => t.toLowerCase() === item.toLowerCase()));
    setSuggestions(filteredCategories);
  };

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
      <Grid
        className={styles.GridSpaceTop}
        container
        columns={{xs: 4, sm: 8, md: 12}}
      >
        {/* left column with image only shows if not new dish*/}
        {!props.add && (
          <Grid item xs={4} sm={2} md={3}>
            <img 
              src={pictures.length > 0 ? pictures[0].base64 : defaultDishImage}
              className={styles.ImageDimensions}
              alt={t('components.DishForm.alt-img')}
            />
            <div className={styles.FormControlMargin}>
              <FormControl className={styles.ImageFlex}>
                <ThemeProvider theme={PageBtn()}>
                  <Button
                    className={styles.FormControlMargin}
                    variant="outlined"
                    component="label"
                  >
                    {t('components.DishForm.change-img')}
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleFileChange}/>
                  </Button>
                  <Button
                    className={styles.FormControlMargin}
                    variant="text"
                    component="label"
                    onClick={handeFileDelete}
                  >
                    {t('components.DishForm.delete-img')}
                  </Button>
                </ThemeProvider>
              </FormControl>
            </div>
          </Grid>
        )}
        <Grid className={styles.TextNextToImageField} item xs={4} sm={6} md={9}>
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
            <Grid item xs={4} sm={5} md={8} className={styles.FieldMarginRight}>
              <FormControl fullWidth>
                <TextField
                  required
                  label={t('components.DishForm.name')}
                  error={invalidDishname}
                  helperText={invalidDishname ?
                    t('components.DishForm.name-is-required') : ""}
                  defaultValue={dish}
                  id="component-outlined"
                  fullWidth
                  onChange={(e) => {
                    setDish(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={3} md={4} className={styles.FieldMarginLeft}>
              <FormControl fullWidth>
                <TextField
                  required
                  label={t('components.DishForm.price')}
                  id="outlined-end-adornment"
                  error={invalidPrice}
                  helperText={invalidPrice ?
                    t('components.DishForm.price-is-required') : ""}
                  fullWidth
                  value={dishPrice}
                  onChange={(e) => {
                    const regex = /^\d+(?:[.,]\d*?)?$/;
                    if (e.target.value === "" || regex.test(e.target.value)) {
                      setDishPrice(e.target.value);
                    }
                  }}
                  InputProps={{
                    endAdornment:
                            <InputAdornment position="end">
                              €
                            </InputAdornment>
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label={t('components.DishForm.description')}
                  defaultValue={dishDescription}
                  multiline
                  onChange={(e) => setDishDescription(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={productListTest}
                getOptionLabel={(option) => (option ? (option as string) : "")}
                defaultValue={dishProd}
                filterSelectedOptions
                onChange={(e, value) => {
                  setDishProd(value.map((product: string) => product));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('common.products')}
                    required
                    error={invalidProducts}
                    helperText={invalidProducts ?
                      t('components.DishForm.select-min-one-product') : null}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={restoList}
                getOptionLabel={(option) => (option ? (option as string) : "")}
                defaultValue={dishResto}
                filterSelectedOptions
                onChange={handleRestoChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('components.DishForm.resto')}
                    required
                    error={invalidResto}
                    helperText={invalidResto ?
                      t('components.DishForm.select-min-one-resto') : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <Autocomplete
                  id="tags-outlined"
                  options={restoChains}
                  value={valueRestoChain}
                  getOptionLabel={(option) =>
                    (option ? (option as {uid:number, name:string}).name : "")}
                  onChange={(e, value, reason) => {
                    if (reason !== 'clear') {
                      setValueRestoChain(value);
                      setSelectedRestoChainId(value.uid);
                    } else {
                      setValueRestoChain(null);
                      setSelectedRestoChainId(0);
                    }
                  }}
                  inputValue={inputValueRestoChain}
                  onInputChange={(event, newInputValue) => {
                    setInputValueRestoChain(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('components.RestaurantForm.restoChain')}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <Autocomplete
                id="tags-outlined"
                options={suggestions}
                getOptionLabel={(option) => (option ? option : "")}
                value={dishCategory.length > 0 ? dishCategory[0] : null}
                onChange={(e, value) => {
                  setDishCategory(value ? [value] : []);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('components.DishForm.food-category')}
                    required
                    error={invalidCategory}
                    helperText={invalidCategory ? t('components.DishForm.select-min-one-category') : null}
                  />
                )}
                />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ThemeProvider theme={PageBtn()}>
        <Button
          className={styles.SaveBtn}
          variant="contained"
          sx={{width: "12.13rem"}}
          onClick={sendRequestAndGoBack}
        >
          {t('common.save')}
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default DishForm;
