IDishFormProps:
---------------

```java
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
```

DishForm:
---------

```java
const DishForm = (props: IDishFormProps)
```

### DishForm variables:

```java
 const navigate = useNavigate();
  let { dishName, dishProducts, dishDescription, price,
    selectCategory, selectAllergene, restoName } = props;
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
```

### Initialize Products:

```java
useEffect(() => {
    getAllProducts()
      .then((res) => {
        allDishProd = res.map((item: IProduct) => item.name);
        setProductListTest(allDishProd);
      });
  }, []);
```

### Initialize Restaurants:

```java
useEffect(() => {
    getAllResto()
      .then((res) => {
        allRestoNames = res.map((item: IRestaurantFrontEnd) => item.name);
        setRestoList(allRestoNames);
      });
  }, []);
```

### Send request and go back to previous page:

```java
async function sendRequestAndGoBack() {
    for (let i = 0; i < restoName.length; i++) {
      dishList[i] = {
        name: dishName,
        description: dishDescription,
        price: price,
        products: dishProducts,
        allergens: selectAllergene,
        category: {
          foodGroup: selectCategory[0],
          extraGroup: [],
          menuGroup: selectCategory[0]
        },
        resto: restoName[i]
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
    return NavigateTo("/dishes", navigate, { successfulForm: true });
  }
```

### Display DishForm:

```java
<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Grid
        className={styles.GridSpaceTop}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
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
                  <input hidden accept="image/*" multiple type="file" />
                </Button>
                <Button
                  className={styles.FormControlMargin}
                  variant="text"
                  component="label"
                >
                  Delete Image
                  <input hidden accept="image/*" multiple type="file" />
                </Button>
              </ThemeProvider>
            </FormControl>
          </div>
        </Grid>
        <Grid className={styles.TextNextToImageField} item xs={4} sm={6} md={9}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={4} sm={5} md={8} className={styles.FieldMarginRight}>
              <FormControl fullWidth>
                <TextField
                  label="Name"
                  defaultValue={dishName}
                  id="component-outlined"
                  fullWidth
                  onChange={(e) => {
                    dishName = e.target.value;
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={3} md={4} className={styles.FieldMarginLeft}>
              <FormControl fullWidth>
                <TextField
                  label="Price"
                  id="outlined-end-adornment"
                  fullWidth
                  defaultValue={price?.toFixed(2)}
                  onChange={(e) => {
                    price = parseInt(e.target.value);
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
                defaultValue={dishProducts}
                filterSelectedOptions
                onChange={(e, value) => {
                  dishProducts = value.map((product: string) => product);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Products" />
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
                defaultValue={selectCategory}
                filterSelectedOptions
                onChange={(e, value) => {
                  selectCategory = value.map((product: string) => product);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Food Category"
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
                defaultValue={restoName}
                filterSelectedOptions
                onChange={(e, value) => {
                  restoName = value.map((restoNameVar: string) => restoNameVar);
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
```