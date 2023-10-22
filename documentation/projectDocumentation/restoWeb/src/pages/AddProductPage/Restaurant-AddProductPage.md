AddProductPage:
---------------

```java
const AddProductPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My new product</span>
      </div>
      <Layout>
        <ProductForm />
      </Layout>
    </div>
  );
};
```