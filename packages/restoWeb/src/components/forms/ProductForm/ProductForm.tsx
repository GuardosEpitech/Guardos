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

import { addNewProduct } from "@src/services/productCalls";
import { getAllResto } from "@src/services/restoCalls";
import { IIngredient, IProduct, IRestaurantFrontEnd, IRestoName }
  from "shared/models/restaurantInterfaces";
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
}

const ProductForm = (props: IDishFormProps) => {
  const navigate = useNavigate();
  let { productName, productIngredients } = props;
  const [restoList, setRestoList] = useState<Array<IRestaurantFrontEnd>>([]);
  let restoNameList = [] as IRestoName[];
  let selectedResto: string[] = [];

  useEffect(() => {
    getAllResto()
      .then((res) => {
        setRestoList(res);
        restoNameList = restoList.map((restaurant) =>
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
    const product: IProduct = {
      name: productName,
      ingredients: productIngredients,
      allergens: []
    };

    for (let i = 0; i < selectedResto.length; i++) {
      await addNewProduct(product, selectedResto[i]);
    }
    return NavigateTo("/products", navigate, { successfulForm: true });
  }

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
                onChange={(e) => {
                  productName = e.target.value;
                }}
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
                (option ? (option as IRestoName).name : "")}
              defaultValue={restoNameList}
              filterSelectedOptions
              onChange={(e, value) => {
                selectedResto = value.map((restoNameVar: IRestoName) =>
                  restoNameVar.name);
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
