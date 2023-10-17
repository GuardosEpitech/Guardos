ProductPage:
------------

```java
const ProductsPage = () => {
  const [productData, setProductData] = useState<Array<IProduct>>([]);

  useEffect(() => {
    updateProductData();
  }, []);

  const updateProductData = () => {
    getAllProducts()
      .then((res) => {
        setProductData(res);
      });
  };

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My products</span>
      </div>
      <Layout>
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="space-between"
        >
          {productData.map((product, index) => (
            <ProductCard
              key={index}
              index={index}
              product={product}
              onUpdate={updateProductData}
            />
          ))}
        </Grid>
      </Layout>
      <FixedBtn title="Add product" redirect="/addProduct" />
      <SuccessAlert />
    </div>
  );
};
```