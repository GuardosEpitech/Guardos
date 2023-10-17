DishesPage:
-----------

```java
const DishesPage = () => {
  const [dishData, setDishData] = useState<Array<IDishFE>>([]);

  useEffect(() => {
    updateDishData();
  }, []);

  const updateDishData = () => {
    getAllDishes()
      .then((res) => {
        setDishData(res);
      });
  };

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My dishes</span>
      </div>
      <Layout>
        {dishData.map((dish, index) => {
          return (
            <Dish
              key={dish.name + index}
              dish={dish}
              onUpdate={updateDishData}
              editable
            />
          );
        })}
      </Layout>
      <FixedBtn title="Add dish" redirect="/addDish" />
      <SuccessAlert />
    </div>
  );
};
```