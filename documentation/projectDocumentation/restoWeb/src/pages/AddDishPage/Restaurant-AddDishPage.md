AddDishPage:
------------

```java
const AddDishPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new dish</span>
      </div>
      <Layout>
        <DishForm add />
      </Layout>
    </div>
  );
};
```