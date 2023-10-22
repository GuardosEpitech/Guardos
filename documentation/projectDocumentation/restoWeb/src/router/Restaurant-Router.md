MVPRouter:
----------

```java
const MVPRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppOutlet />}>
          <Route path="addDish" element={<AddDishPage />} />
          <Route path="addProduct" element={<AddProductPage />} />
          <Route path="addResto" element={<AddRestaurantPage />} />
          <Route path="dishes" element={<DishesPage />} />
          <Route path="editDish" element={<EditDishPage />} />
          <Route path="editResto" element={<EditRestaurantPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="/" element={<HomePage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

Add new route:
--------------

### 1\. Import page:

```java
import CreatedPage from "@src/pages/CreatedPage";
```

### 2\. Add to router:

Add new route between ‘<Routes>’ and ‘</Route>’.

```java
<Route path="createdRoute" element={<CreatedPage />} />
```