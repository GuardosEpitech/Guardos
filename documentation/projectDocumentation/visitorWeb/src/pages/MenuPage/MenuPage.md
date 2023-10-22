MenuPage:
---------

```java
const MenuPage = () => {
  const { menu, restoName, address } = useLocation().state;

  return (
    <>
      <Header />
      <div className={styles.RectOnImg}>
        <List>
          <ListItem>
            <h2 className={styles.RestaurantTitle}>{restoName}</h2>
          </ListItem>
          <ListItem>
            <div className={styles.Address}>
              <ThemeProvider theme={theme}>
                <PlaceIcon color="primary" />
              </ThemeProvider>
              <span className={styles.RestaurantAddress}>{address}</span>
            </div>
          </ListItem>
        </List>
      </div>
      <Layout>
        {menu.map((category: ICategories, index: number) => {
          return (
            <>
              {category.dishes.length > 0 &&
                <Category key={category.name + index} title={category.name}>
                  {category.dishes.map((dish: IDishFE, index: number) => {
                    return (
                      <Dish
                        key={dish.name + index}
                        dishName={dish.name}
                        dishAllergens={dish.allergens}
                        dishDescription={dish.description}
                        options={dish.category.extraGroup.join(", ")}
                        imageSrc={dish.pictures[0]}
                        price={dish.price}
                      />
                    )
                  })}
                </Category>}
            </>
          )
        })}
      </Layout>
    </>
  );
};
```