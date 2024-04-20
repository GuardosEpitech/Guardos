import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "@src/pages/MenuPage";
import HomePage from "@src/pages/HomePage";
import RegistrationPage from "@src/pages/RegistrationPage";
import LoginPage from "@src/pages/LoginPage";
import MapPage from "@src/pages/MapPage";
import ContactPage from "@src/pages/ContactPage/ContactPage";
import AboutUsPage from "@src/pages/AboutUsPage/AboutUsPage";
import AppOutlet from "@src/pages/AppOutlet";
import MyAccountPage from "@src/pages/MyAccountPage";
import IntroPage from "@src/pages/IntroPage";
import ResetPassword from "@src/pages/ResetPasswordPage/ResetPassword";
import CookieBanner from "@src/components/CookieBanner/CookieBanner";
import PaymentSuccessPage from "@src/pages/Payments/Accept/PaymentSuccessPage";
import PaymentFailedPage from "@src/pages/Payments/Failed/PaymentFailedPage";
import RestoPage from "@src/pages/RestoPage";
import FeatureRequest from "@src/pages/FeatureRequest";
import ChangePasswordPage from "@src/pages/ChangePasswordPage/ChangePasswordPage";
import RatingPage from "@src/pages/RatingPage";
import CookieStatement from "@src/pages/CookieStatement/CookiePage";
import TechnologyList from "@src/pages/TechnologyPage/TechnologyPage";
import { getUserPreferences } from "@src/services/profileCalls";

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
      const data = await getUserPreferences(userToken);
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
        {isUserTokenSet === false && window.location.pathname !== '/register'
        && window.location.pathname !== '/account-recovery' && 
        window.location.pathname !== '/payment-failed' && 
        window.location.pathname !== '/payment-success' &&
        window.location.pathname !== '/change-password' &&
        window.location.pathname !== '/intropage' &&
        window.location.pathname !== '/cookiestatement' &&
        window.location.pathname !== '/technologies' && (
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
            <Route path="/my-account" element={<MyAccountPage />} />
            <Route path="/intropage" element={<IntroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/addreview" element={<RatingPage />} />
          <Route path="/map" element={<MapPage />} />
            <Route path="/" element={<RestoPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/account-recovery" element={<ResetPassword />} />
          <Route path="/feature-request" element={<FeatureRequest />}> </Route>
          <Route path="/account-recovery" element={<ResetPassword />}></Route>
            <Route path="/payment-success" Component={PaymentSuccessPage} />
          <Route path="/payment-failed" Component={PaymentFailedPage} />
          <Route path="/change-password" element={<ChangePasswordPage />}></Route>
          <Route path="/cookiestatement" element={<CookieStatement />}></Route>
          <Route path="/technologies" element={<TechnologyList />}></Route>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MVPRouter;
