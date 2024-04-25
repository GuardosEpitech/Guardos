import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate }
  from "react-router-dom";

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
import RegistrationPage from "@src/pages/RegistrationPage";
import LoginPage from "@src/pages/LoginPage";
import ResetPassword from "@src/pages/ResetPasswordPage";
import ChangePasswordPage from "@src/pages/ChangePasswordPage";
import MyAccountPage from "@src/pages/MyAccountPage";
import FeatureRequest from "@src/pages/FeatureRequest";
import PrivacyPage from "@src/pages/PrivacyPage";
import ImprintPage from "@src/pages/ImprintPage/ImprintPage";

const MVPRouter = () => {
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>();
  const userToken = localStorage.getItem('user');

  const checkUserToken = () => {
    if (userToken === null) {
      setIsUserTokenSet(false);
      return;
    }
    setIsUserTokenSet(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isUserTokenSet, userToken]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {isUserTokenSet === false && window.location.pathname !== '/register'
        && window.location.pathname !== '/account-recovery' &&
        window.location.pathname !== '/payment-failed' && 
        window.location.pathname !== '/payment-success' &&
        window.location.pathname !== '/change-password' && (
        <Navigate to="login" />
      )}
      {isUserTokenSet === true && (window.location.pathname === '/register'
      || window.location.pathname === '/account-recovery' ||
      window.location.pathname === '/login'
      ) && (
        <Navigate to="/" />
      )}
      <Routes>
        <Route element={<AppOutlet />}>
          <Route path="addDish" element={<AddDishPage />} />
          <Route path="addProduct" element={<AddProductPage />} />
          <Route path="addResto" element={<AddRestaurantPage />} />
          <Route path="dishes" element={<DishesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="account" element={<MyAccountPage />} />
          <Route path="editDish" element={<EditDishPage />} />
          <Route path="editProduct" element={<EditProductPage />} />
          <Route path="editResto" element={<EditRestaurantPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/account-recovery" element={<ResetPassword />} />
          <Route path="/feature-request" element={<FeatureRequest />}> </Route>
          <Route path="/account-recovery" element={<ResetPassword />}></Route>
          <Route path="/change-password" element={<ChangePasswordPage />}></Route>
          <Route path="/privacy" element={<PrivacyPage />}></Route>
          <Route path="/imprint" element={<ImprintPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MVPRouter;
