IDishFormProps:
---------------

```java
interface IDishFormProps {
  productName?: string;
  productIngredients?: string[];
}
```

ProductForm:
------------

```java
const ProductForm = (props: IDishFormProps)
```

### Set up variables:

```java
const navigate = useNavigate();
  let { productName, productIngredients } = props;
  const [restoList, setRestoList] = useState<Array<IRestaurantFrontEnd>>([]);
  let restoNameList = [] as IRestoName[];
  let selectedResto: string[] = [];
  
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
```

### Initialize Restaurants:

```java
 useEffect(() => {
    getAllResto()
      .then((res) => {
        setRestoList(res);
        restoNameList = restoList.map((restaurant) =>
          ({ name: restaurant.name }));
      });
  }, []);
```

### Send request and go to previous page:

```java
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
```

### Display ProductForm:

```java
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
```