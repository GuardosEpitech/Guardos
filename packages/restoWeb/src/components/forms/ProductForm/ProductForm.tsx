import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { addNewProduct, editProduct } from "@src/services/productCalls";
import { getAllResto } from "@src/services/restoCalls";
import { getAllIngredients } from "@src/services/ingredientsCalls";
import { IIngredient, IProduct, IRestaurantFrontEnd, IRestoName }
  from "shared/models/restaurantInterfaces";
import { IProductFE }
  from "shared/models/productInterfaces";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "@src/components/forms/ProductForm/ProductForm.module.scss";

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
  productName?: string;
  productIngredients?: string[];
  productAllergens?: string[];
  productRestaurant?: IRestaurantFrontEnd[];
  productRestaurantIds?: number[];
  editable?: boolean;
}

const ProductForm = (props: IDishFormProps) => {
  const navigate = useNavigate();
  let { productName, productIngredients, productAllergens, productRestaurant, productRestaurantIds, editable } = props;
  const [restoList, setRestoList] = useState<Array<IRestaurantFrontEnd>>([]);
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  const originalName = productName;
  let restoNameListTemp = [] as IRestoName[];
  let selectedResto: string[] = [];

  useEffect(() => {
    getAllResto()
      .then((res) => {
        if (editable) {
          const newFilteredList = res.filter((option: IRestaurantFrontEnd) => !productRestaurantIds.includes(option.id));
          setRestoList(newFilteredList);
        } else {
          setRestoList(res);
        }
        restoNameListTemp = res.map((restaurant: IRestaurantFrontEnd) =>
          ({ name: restaurant.name }));
      });
  }, []);

  const ingredients: IIngredient[] = [
    { name: "Milk" },
    { name: "Wheat" },
    { name: "Egg" },
    { name: "Tomato" },
    { name: "Salt" },
  ];
  const productIngredientsList = ingredients.filter((product) =>
    productIngredients?.includes(product.name)
  );

  async function sendRequestAndGoBack() {
    if (isInputEmpty) {
      return;
    }
    const product: IProduct = {
      name: productName,
      ingredients: productIngredients,
      allergens: []
    };

    if (editable) {
      const product: IProductFE = {
        name: productName,
        ingredients: productIngredients,
        allergens: [],
        restaurantId: productRestaurantIds,
        id: 0
      };
      await editProduct(product, originalName);
    } else {
      for (let i = 0; i < selectedResto.length; i++) {
        await addNewProduct(product, selectedResto[i]);
      }
    }
    return NavigateTo("/products", navigate, { successfulForm: true });
  }

  const handleInputChange = (event:any) => {
    const value = event.target.value;
    productName = value;
    
    // Check if the input is empty
    setIsInputEmpty(value.trim() === '');
  };

  return (
    <Container maxWidth={"md"}>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Grid
          className={styles.GridSpaceTop}
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4} sm={8} md={12}>
            <FormControl fullWidth>
              <TextField
                label="Name"
                defaultValue={productName}
                id="component-outlined"
                fullWidth
                onChange={handleInputChange}
                error={isInputEmpty}
                helperText={isInputEmpty ? 'Input cannot be empty' : ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={8} md={12}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={ingredients}
              getOptionLabel={(option) =>
                option ? (option as IIngredient).name : ""
              }
              defaultValue={productIngredientsList}
              filterSelectedOptions
              onChange={(e, value) => {
                productIngredients = value.map(
                  (ingredient: IProduct) => ingredient.name
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Ingredients" />
              )}
            />
          </Grid>
          <Grid item xs={4} sm={8} md={12}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={restoList}
              getOptionLabel={(option) =>
                (option ? (option as IRestaurantFrontEnd).name : "")}
              defaultValue={productRestaurant}
              filterSelectedOptions
              onChange={(e, value) => {
                selectedResto = value.map((restoNameVar: IRestaurantFrontEnd) =>
                  restoNameVar.name);
                productRestaurantIds = value.map((restoNameVar: IRestaurantFrontEnd) => restoNameVar.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Restaurant"
                />
              )}
            />
          </Grid>
        </Grid>
        <ThemeProvider theme={PageBtn()}>
          <Button
            className={styles.SaveBtn}
            variant="contained"
            sx={{ width: "12.13rem" }}
            onClick={sendRequestAndGoBack}
          >
            Save
          </Button>
        </ThemeProvider>
      </Box>
    </Container>
  );
};

export default ProductForm;
