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
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { addNewProduct, editProduct } from "@src/services/productCalls";
import { IIngredient, IProduct, IRestaurantFrontEnd, IRestoName } from "shared/models/restaurantInterfaces";
import { IProductFE } from "shared/models/productInterfaces";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "@src/components/forms/ProductForm/ProductForm.module.scss";
import { getAllRestaurantsByUser } from "@src/services/restoCalls";
import { useTranslation } from "react-i18next";
import { getAllIngredients, addIngredient } from "@src/services/ingredientsCalls";
import { add } from "cypress/types/lodash";

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
  productName?: string;
  productIngredients?: string[];
  productAllergens?: string[];
  productRestaurant?: IRestaurantFrontEnd[];
  productRestaurantIds?: number[];
  editable?: boolean;
}

const ProductForm = (props: IDishFormProps) => {
  const navigate = useNavigate();
  const { productName: initialProductName, productIngredients: initialProductIngredients = [], productAllergens, productRestaurant, productRestaurantIds, editable } = props;
  const [restoList, setRestoList] = useState<Array<IRestaurantFrontEnd>>([]);
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  const [isInputEmptyIngredients, setIsInputEmptyIngredients] = useState(false);
  const [isInputEmptyRestaurant, setIsInputEmptyRestaurant] = useState(false); 
  const [ingredientFeedback, setIngredientFeedback] = useState<string>("");
  const [apiIngredients, setApiIngredients] = useState<IIngredient[]>([]);
  const [productIngredients, setProductIngredients] = useState<string[]>(initialProductIngredients);
  const [productName, setProductName] = useState<string>(initialProductName || "");
  const [selectedResto, setSelectedResto] = useState<string[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const userToken = localStorage.getItem('user');
    getAllRestaurantsByUser({ key: userToken })
      .then((res) => {
        if (editable) {
          const newFilteredList = res.filter((option: IRestaurantFrontEnd) =>
            !productRestaurantIds?.includes(option.uid || 0));
          setRestoList(newFilteredList);
          if (productRestaurant) {
            setSelectedResto([productRestaurant[0].name]);
          }
        } else {
          setRestoList(res);
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });

    getAllIngredients()
      .then((ingredientsFromAPI) => {
        setApiIngredients(ingredientsFromAPI || []);
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
      });
  }, []);
  
  const allIngredients = apiIngredients || [];

  async function sendRequestAndGoBack() {
    if (productName === '') {
      setIsInputEmpty(true);
      return;
    } else {
      setIsInputEmpty(false);
    }

    if (productIngredients.length === 0) {
      setIsInputEmptyIngredients(true);
    } else {
      setIsInputEmptyIngredients(false);
    }

    if (selectedResto.length === 0) {
      setIsInputEmptyRestaurant(true);
    } else {
      setIsInputEmptyRestaurant(false);
    }

    if (productName === '' ||
      productIngredients.length === 0 ||
      selectedResto.length === 0) {
      return;
    }

    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
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
        userID: 0,
        ingredients: productIngredients,
        allergens: [],
        restaurantId: productRestaurantIds || [],
        id: 0
      };
      await editProduct(product, initialProductName, userToken);
    } else {
      for (let i = 0; i < selectedResto.length; i++) {
        await addNewProduct(product, selectedResto[i], userToken);
        // insert to new product here
      }
    }
    return NavigateTo("/products", navigate, { successfulForm: true });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProductName(value);
    setIsInputEmpty(value.trim() === '');
  };

  const handleIngredientChange = async (event: React.ChangeEvent<{}>, value: string[]) => {
    try {
      setProductIngredients(value);
      setIsInputEmpty(value.length === 0);

      let valueIndex = 0;
      for (const ingredient of value) {
        if (!allIngredients.some(ing => ing.name === ingredient)) {
          const response = await addIngredient(ingredient);
          if (response.status === 200) {
            setIngredientFeedback(`Ingredient ${ingredient} has been added to the database.`);
            const updatedIngredients = await getAllIngredients();
            setApiIngredients(updatedIngredients || []);
            value[valueIndex] = response.data;
            setProductIngredients(value);
          } else {
            throw new Error(`Failed to add ingredient ${ingredient}`);
          }
        }
        valueIndex++;
      }
    } catch (error) {
      value.pop();
      setProductIngredients(value);
      console.error("Error handling ingredient change:", error);
      setIngredientFeedback(`Error: ${error.message}`);
    }
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
                label={t('components.ProductForm.name')}
                value={productName}
                id="component-outlined"
                fullWidth
                required
                onChange={handleInputChange}
                error={isInputEmpty}
                helperText={isInputEmpty ?
                  t('components.ProductForm.input-empty-error') : ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={8} md={12}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={allIngredients.map((option) => option.name)}
              value={productIngredients}
              onChange={handleIngredientChange}
              freeSolo
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label={t('common.ingredients')}
                  required
                  error={isInputEmptyIngredients}
                  helperText={isInputEmptyIngredients ?
                    t('components.ProductForm.input-empty-error') : ''}
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {t('components.ProductForm.english-please')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {ingredientFeedback}
            </Typography>
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
                setSelectedResto(value.map(
                  (restoNameVar: IRestaurantFrontEnd) => restoNameVar.name));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('components.ProductForm.resto')}
                  required
                  error={isInputEmptyRestaurant}
                  helperText={isInputEmptyRestaurant ?
                    t('components.ProductForm.input-empty-error') : ''}
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
            {t('common.save')}
          </Button>
        </ThemeProvider>
      </Box>
    </Container>
  );
};

export default ProductForm;
