import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddDishPage from "@src/pages/AddDishPage";
import AppOutlet from "@src/pages/AppOutlet/AppOutlet";
import AddProductPage from "@src/pages/AddProductPage";
import AddRestaurantPage from "@src/pages/AddRestaurantPage";
import DishesPage from "@src/pages/DishesPage";
import EditDishPage from "@src/pages/EditDishPage";
import EditProductPage from "@src/pages/EditProductPage";
import EditRestaurantPage from "@src/pages/EditRestaurantPage";
import HomePage from "@src/pages/HomePage";
import MenuPage from "@src/pages/MenuPage";
import ProductsPage from "@src/pages/ProductsPage";
import ScrollToTop from "@src/components/ScrollToTop/ScrollToTop";

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
          <Route path="editProduct" element={<EditProductPage />} />
          <Route path="editResto" element={<EditRestaurantPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="/" element={<HomePage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MVPRouter;
