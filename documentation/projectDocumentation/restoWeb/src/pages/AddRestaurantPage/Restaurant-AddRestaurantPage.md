AddRestaurantPage:
------------------

```java
const AddRestaurantPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new restaurant</span>
      </div>
      <Layout>
        <RestaurantForm add />
      </Layout>
    </div>
  );
};
```