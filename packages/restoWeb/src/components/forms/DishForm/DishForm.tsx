import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

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
import {getAllProducts} from "@src/services/productCalls";
import {addNewDish, editDish} from "@src/services/dishCalls";
import {IProduct, IRestaurantFrontEnd}
  from "shared/models/restaurantInterfaces";
import {IDishFE} from "shared/models/dishInterfaces";
import {getAllResto} from "@src/services/restoCalls";
import {NavigateTo} from "@src/utils/NavigateTo";
import placeholderImg from "@src/assets/placeholder.png";
import styles from "@src/components/forms/DishForm/DishForm.module.scss";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Montserrat",
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
  dishProducts?: string[];
  dishDescription?: string;
  imageSrc?: string;
  price?: number;
  add?: boolean;
  selectCategory?: string[];
  selectAllergene?: string[];
  restoName?: string[];
}

const DishForm = (props: IDishFormProps) => {
  const navigate = useNavigate();
  const [dish, setDish] = useState<string>(props.dishName || "");
  const [dishPrice, setDishPrice] =
    useState<string>(props.price?.toString() || "");
  const [dishProd, setDishProd] = useState<string[]>(props.dishProducts || []);
  const [dishCategory, setDishCategory] =
    useState<string[]>(props.selectCategory || []);
  const [dishResto, setDishResto] = useState<string[]>(props.restoName || []);
  const [invalidDishname, setInvalidDishname] = useState<boolean>(false);
  const [invalidPrice, setInvalidPrice] = useState<boolean>(false);
  const [invalidResto, setInvalidResto] = useState<boolean>(false);
  const [invalidProducts, setInvalidProducts] = useState<boolean>(false);
  const [invalidCategory, setInvalidCategory] = useState<boolean>(false);

  let {dishDescription, selectAllergene} = props;
  const imageSrc = props.imageSrc &&
  props.imageSrc.length !== 0 ? props.imageSrc : placeholderImg;
  const [productListTest, setProductListTest] = useState<Array<string>>([]);
  const [restoList, setRestoList] = useState<Array<string>>([]);
  let allRestoNames: string[] = [];
  let allDishProd: string[] = [];
  const suggestions: string[] = ["Appetizer", "Maindish", "Dessert"];
  const suggestionsAller: string[] = ["No Allergens", "Celery", "Gluten",
    "Crustaceans", "Eggs", "Fish", "Lupin", "Milk", "Molluscs", "Mustard",
    "Nuts", "Peanuts", "Sesame seeds", "Soya", "Sulphur dioxide", "Lactose"];
  const dishList: IDishFE[] = [];

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        allDishProd = res.map((item: IProduct) => item.name);
        setProductListTest(allDishProd);
      });
  }, []);

  useEffect(() => {
    getAllResto()
      .then((res) => {
        allRestoNames = res.map((item: IRestaurantFrontEnd) => item.name);
        setRestoList(allRestoNames);
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

    for (let i = 0; i < dishResto.length; i++) {
      dishList[i] = {
        name: dish,
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
        resto: dishResto[i]
      };
    }

    if (props.add) {
      for (let i = 0; i < dishList.length; i++) {
        await addNewDish(dishList[i].resto, dishList[i]);
      }
    } else {
      for (let i = 0; i < dishList.length; i++) {
        await editDish(dishList[i].resto, dishList[i]);
      }
    }
    return NavigateTo("/dishes", navigate, {successfulForm: true});
  }

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
      <Grid
        className={styles.GridSpaceTop}
        container
        columns={{xs: 4, sm: 8, md: 12}}
      >
        <Grid item xs={4} sm={2} md={3}>
          <img
            className={styles.ImageDimensions}
            src={imageSrc}
            alt="Resto Img"
          />
          <div className={styles.FormControlMargin}>
            <FormControl className={styles.ImageFlex}>
              <ThemeProvider theme={PageBtn()}>
                <Button
                  className={styles.FormControlMargin}
                  variant="outlined"
                  component="label"
                >
                  Change Image
                  <input hidden accept="image/*" multiple type="file"/>
                </Button>
                <Button
                  className={styles.FormControlMargin}
                  variant="text"
                  component="label"
                >
                  Delete Image
                  <input hidden accept="image/*" multiple type="file"/>
                </Button>
              </ThemeProvider>
            </FormControl>
          </div>
        </Grid>
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
                  label="Name"
                  error={invalidDishname}
                  helperText={invalidDishname ? "Name is required" : ""}
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
                  label="Price"
                  id="outlined-end-adornment"
                  error={invalidPrice}
                  helperText={invalidPrice ? "Price is required" : ""}
                  fullWidth
                  value={dishPrice}
                  onChange={(e) => {
                    const regex = /^-?\d+(?:[.,]\d*?)?$/;
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
                  label="Description"
                  defaultValue={dishDescription}
                  multiline
                  onChange={(e) => {
                    dishDescription = e.target.value;
                  }}
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
                    label="Products"
                    required
                    error={invalidProducts}
                    helperText={invalidProducts ?
                      "Please select at least one product" : null}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={suggestionsAller}
                getOptionLabel={(option) => (option ? (option as string) : "")}
                defaultValue={selectAllergene}
                filterSelectedOptions
                onChange={(e, value) => {
                  selectAllergene = value.map((allergene: string) => allergene);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Allergens"
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={suggestions}
                getOptionLabel={(option) => (option ? (option as string) : "")}
                defaultValue={dishCategory}
                filterSelectedOptions
                onChange={(e, value) => {
                  setDishCategory(value.map((product: string) => product));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Food Category"
                    required
                    error={invalidCategory}
                    helperText={invalidCategory ?
                      "Please select at least one category" : null}
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
                onChange={(e, value) => {
                  setDishResto(value.map((restoNameVar: string) =>
                    restoNameVar));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Restaurant"
                    required
                    error={invalidResto}
                    helperText={invalidResto ?
                      "Please select a restaurant" : ""}
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
          Save
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default DishForm;
