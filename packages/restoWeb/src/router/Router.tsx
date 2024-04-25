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
import CookieStatement from "@src/pages/CookieStatement/CookiePage";
import TechnologyList from "@src/pages/TechnologyPage/TechnologyPage";
import CookieBanner from "@src/components/CookieBanner/CookieBanner";
import { getUserRestoPreferences } from "@src/services/profileCalls";

const MVPRouter = () => {
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>();
  const [showCookies, setShowCookies] = useState<boolean>();
  const userToken = localStorage.getItem('user');

  const checkUserToken = () => {
    if (userToken === null) {
      setIsUserTokenSet(false);
      return;
    }
    setIsUserTokenSet(true);
  };

  const areCookiesSet = async () => {
    if (isUserTokenSet) {
      const data = await getUserRestoPreferences(userToken);
      if (data.isSet) {
        setShowCookies(false);
      } 
    } 
    setShowCookies(true);
    return false;
  }

  useEffect(() => {
    checkUserToken();
    areCookiesSet();
  }, [isUserTokenSet, userToken]);

  return (
    <>
    {showCookies && <CookieBanner />}
    <BrowserRouter>
      <ScrollToTop />
      {isUserTokenSet === false && window.location.pathname !== '/register'
        && window.location.pathname !== '/account-recovery' &&
        window.location.pathname !== '/payment-failed' && 
        window.location.pathname !== '/payment-success' &&
        window.location.pathname !== '/change-password' &&
        window.location.pathname !== '/cookiestatement' &&
        window.location.pathname !== '/technologies' &&  (
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
          <Route path="/cookiestatement" element={<CookieStatement />}></Route>
          <Route path="/technologies" element={<TechnologyList />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default MVPRouter;
