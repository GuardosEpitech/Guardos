import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate }
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
import PrivacyPage from "../../../shared/pages/PrivacyPage";
import ImprintPage from "../../../shared/pages/ImprintPage";
import CookieStatement from "@src/pages/CookieStatement/CookiePage";
import TechnologyList from "@src/pages/TechnologyPage/TechnologyPage";
import CookieBanner from "@src/components/CookieBanner/CookieBanner";
import { getUserRestoPreferences } from "@src/services/profileCalls";
import AddCategoryPage from "@src/pages/AddCategoryPage";
import AddRestoChainPage from "@src/pages/AddRestoChainPage";
import RestoOverViewPage from "@src/pages/RestoOverViewPage";
import SubscriptionPage from "@src/pages/SubscriptionPage/SubscriptionPage";
import PaymentAddCancelPage from "@src/pages/Payments/PaymentAddCancel/PaymentAddCancel";
import PaymentAddSuccessPage from "@src/pages/Payments/PaymentAddSuccess/PaymentAddSuccess";
import PaymentPage from "@src/pages/Payments/PaymentsPage/PaymentPage";
import UserSupportPage from "@src/pages/UserSupport/UserSupportPage";
import TermsPage from "@src/pages/TermsAndConditionsPage/T&CPage";
import DiscountDishPage from "@src/pages/DiscountDishPage";
import UserInsights from "@src/pages/UserInsights";
import DishComboPage from "@src/pages/DishComboPage";
import GuidesPage from "@src/pages/GuidesPage";
import VerifyEmailPage from "@src/pages/RegistrationPage/VerifyEmailPage";
import { checkDarkMode } from "../utils/DarkMode";

const NavigationHandler = ():any => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        navigate(customEvent.detail);
      }
    };

    const handleStorageEvent = () => {
      const event = new CustomEvent("navigate", { detail: "/" });
      const userEvent = new CustomEvent("setUserToken");
      window.dispatchEvent(event);
      window.dispatchEvent(userEvent);
    };

    window.addEventListener("navigate", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("navigate", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [navigate]);

  return null; // This component doesn't render anything visible
};


const MVPRouter = () => {
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("user"));
  const [showCookies, setShowCookies] = useState<boolean>(true);

  // Fetch and set the user token when the app loads
  useEffect(() => {
    const token = localStorage.getItem("user");
    setUserToken(token);

    const checkCookies = async () => {
      if (token) {
        const data = await getUserRestoPreferences(token);
        setShowCookies(!data?.isSet);
        if (data?.isSet) {
          localStorage.setItem("visitedRestoBefore", "true");
        }
      } else {
        setShowCookies(true);
      }
    };

    checkCookies();
  }, []);

  // Handle cookie banner visibility
  const toggleCookieBanner = (value: boolean) => {
    setShowCookies(value);
  };

  // PrivateRoute for authenticated users
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return userToken ? <>{children}</> : <Navigate to="/login" />;
  };

  const LoginOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    return userToken ? <Navigate to="/" /> : <>{children}</>;
  };

  window.addEventListener('setUserToken', () => {
    setUserToken(localStorage.getItem("user"));
  })

  return (
    <>
      {showCookies && <CookieBanner />}
      <BrowserRouter>
        <ScrollToTop />
        <NavigationHandler />
        <Routes>
          <Route element={<AppOutlet />}>
          <Route
              path="/login"
              element={
                <LoginOnlyRoute>
                  <LoginPage toggleCookieBanner={setShowCookies} />
                </LoginOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <LoginOnlyRoute>
                  <RegistrationPage />
                </LoginOnlyRoute>
              }
            />
            {/* Public routes */}
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/account-recovery" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/cookiestatement" element={<CookieStatement />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/imprint" element={<ImprintPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Protected routes */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/addDish" element={<AddDishPage />} />
                    <Route path="/addProduct" element={<AddProductPage />} />
                    <Route path="/addResto" element={<AddRestaurantPage />} />
                    <Route path="/dishes" element={<DishesPage />} />
                    <Route path="/account" element={<MyAccountPage />} />
                    <Route path="/editDish" element={<EditDishPage />} />
                    <Route path="/editProduct" element={<EditProductPage />} />
                    <Route path="/editResto" element={<EditRestaurantPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/feature-request" element={<FeatureRequest />} />
                    <Route path="/support" element={<UserSupportPage />} />
                    <Route path="/addCategory" element={<AddCategoryPage />} />
                    <Route path="/addRestoChain" element={<AddRestoChainPage />} />
                    <Route path="/restoOverview" element={<RestoOverViewPage />} />
                    <Route path="/subscriptions" element={<SubscriptionPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/success" element={<PaymentAddSuccessPage />} />
                    <Route path="/cancel" element={<PaymentAddCancelPage />} />
                    <Route path="/discount" element={<DiscountDishPage />} />
                    <Route path="/combo" element={<DishComboPage />} />
                    <Route path="/insights" element={<UserInsights />} />
                    <Route path="/guides" element={<GuidesPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MVPRouter;

