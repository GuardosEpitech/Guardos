import React, {useEffect, useState, useMemo} from "react";
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import MenuPage from "@src/pages/MenuPage";
import RegistrationPage from "@src/pages/RegistrationPage";
import LoginPage from "@src/pages/LoginPage";
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
import PrivacyPage from "../../../shared/pages/PrivacyPage";
import ImprintPage from "../../../shared/pages/ImprintPage";
import LoginSuccess from "@src/pages/LoginSuccess/LoginSuccess";
import CookieStatement from "@src/pages/CookieStatement/CookiePage";
import TechnologyList from "@src/pages/TechnologyPage/TechnologyPage";
import {getUserPreferences} from "@src/services/profileCalls";
import SubscriptionPage from "@src/pages/SubscriptionPage/SubscriptionPage";
import PaymentPage from "@src/pages/Payments/PaymentsPage/PaymentPage";
import PaymentAddCancelPage from "@src/pages/Payments/PaymentAddCancel/PaymentAddCancel";
import PaymentAddSuccessPage from "@src/pages/Payments/PaymentAddSuccess/PaymentAddSuccess";
import UserSupportPage from "@src/pages/UserSupport/UserSupportPage";
import TermsPage from "@src/pages/TermsAndConditionsPage/T&CPage";
import GuidesPage from "@src/pages/GuidesPage";
import VerifyEmailPage from "@src/pages/RegistrationPage/VerifyEmailPage";
import { checkDarkMode } from "../utils/DarkMode";
import ViewRatingPage from "@src/pages/ViewRatingPage";

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
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>();
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("user"));
  const [login, setLogin] = useState(false);

  useMemo(() => {
    checkDarkMode();
  }, [location]);

  const checkUserToken = () => {
    if (userToken === null) {
      setIsUserTokenSet(false);
      return;
    }
    setIsUserTokenSet(true);
  };

  // Fetch and set the user token when the app loads
  useEffect(() => {
    const token = localStorage.getItem("user");
    setUserToken(token);

    const checkCookies = async () => {
      if (token) {
        const data = await getUserPreferences(token);
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
      {showCookies && <CookieBanner/>}
      <BrowserRouter>
        <NavigationHandler />
        <Routes>
          <Route element={<AppOutlet/>}>
            {/* Public routes */}
            <Route path="/intropage" element={<IntroPage/>}/>
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
            <Route
              path="/account-recovery"
              element={
                <LoginOnlyRoute>
                  <ResetPassword />
                </LoginOnlyRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <LoginOnlyRoute>
                  <ChangePasswordPage />
                </LoginOnlyRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <LoginOnlyRoute>
                  <VerifyEmailPage />
                </LoginOnlyRoute>
              }
            />
            <Route
              path="/login-success"
              element={
                <LoginOnlyRoute>
                  <LoginSuccess />
                </LoginOnlyRoute>
              }
            />
            {/* Protected routes */}
            <Route
                path="*"
                element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="/my-account" element={<MyAccountPage/>}/>
                      <Route path="/menu/:id" element={<MenuPage />} />
                      <Route path="/addreview" element={<RatingPage/>}/>
                      <Route path="/" element={<RestoPage/>}/>
                      <Route path="/reviews" element={<ViewRatingPage/>}/>
                      <Route path="/about-us" element={<AboutUsPage/>}/>
                      <Route path="/contact" element={<ContactPage/>}/>
                      <Route path="/feature-request" element={<FeatureRequest/>}> </Route>
                      <Route path="/support" element={<UserSupportPage/>}></Route>
                      <Route path="/payment-success" Component={PaymentSuccessPage}/>
                      <Route path="/payment-failed" Component={PaymentFailedPage}/>
                      <Route path="/privacy" element={<PrivacyPage/>}></Route>
                      <Route path="/imprint" element={<ImprintPage/>}></Route>
                      <Route path="/cookiestatement" element={<CookieStatement/>}></Route>
                      <Route path="/technologies" element={<TechnologyList/>}></Route>
                      <Route path="/subscriptions" element={<SubscriptionPage/>}></Route>
                      <Route path="/payment" element={<PaymentPage />}></Route>
                      <Route path="/guides" element={<GuidesPage/>}></Route>
                      <Route path="/success" element={<PaymentAddSuccessPage />}></Route>
                      <Route path="/cancel" element={<PaymentAddCancelPage />}></Route>
                      <Route path="/terms" element={<TermsPage />}></Route>
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </PrivateRoute>
                }>
              </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MVPRouter;
