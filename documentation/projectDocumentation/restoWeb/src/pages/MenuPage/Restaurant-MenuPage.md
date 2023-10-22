IMenuPageProps:
---------------

```java
interface IMenuPageProps {
  menu: [ICategories];
  restoName: string;
  address: string;
}
```

MenuPage:
---------

```java
const MenuPage = () => {
  const { menu, restoName, address } = useLocation().state as IMenuPageProps;

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
        {menu.map((category) => {
          return (
            category.dishes.length > 0 && (
              <Category key={category.name} title={category.name}>
                {category.dishes.map((dish, index) => {
                  return <Dish key={dish.name + index} dish={dish} />;
                })}
              </Category>
            )
          );
        })}
      </Layout>
    </>
  );
};
```