import React, {useEffect, useState, useMemo} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
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

const MVPRouter = () => {
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>();
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const userToken = localStorage.getItem('user');
  const [loading, setLoading] = useState(true);
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

  const areCookiesSet = async () => {
    if (isUserTokenSet) {
      const data = await getUserPreferences(userToken);
      if (data.isSet) {
        setShowCookies(false);
        localStorage.setItem('visitedBefore', 'true');
      } else {
        setShowCookies(true);
      }
    } else {
      setShowCookies(true);
    }
  };

  useEffect(() => {
    checkUserToken();
    areCookiesSet();
    
    const loginToken = localStorage.getItem('freshLogin');
    if (loginToken && loginToken !== 'false') {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [isUserTokenSet, userToken]);

  const toggleCookieBanner = (value: boolean) => {
    setShowCookies(value);
  };

  return (
    <>
      {showCookies && <CookieBanner/>}
      <BrowserRouter>
        {isUserTokenSet === false && window.location.pathname !== '/register'
          && window.location.pathname !== '/account-recovery' &&
          window.location.pathname !== '/verify-email' &&
          window.location.pathname !== '/payment-failed' &&
          window.location.pathname !== '/payment-success' &&
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/change-password' &&
          window.location.pathname !== '/intropage' &&
          window.location.pathname !== '/cookiestatement' &&
          window.location.pathname !== '/technologies' && (
            <Navigate to="login"/>
          )}
        {isUserTokenSet === true && (window.location.pathname === '/register'
          || window.location.pathname === '/account-recovery' || window.location.pathname === '/login'
        ) && (
          <Navigate to="/"/>
        )}
        {isUserTokenSet === true && login === true && (window.location.pathname === '/login') && (
          <Navigate to="/" />
        )}
        <Routes>
          <Route element={<AppOutlet/>}>
            <Route path="/my-account" element={<MyAccountPage/>}/>
            <Route path="/intropage" element={<IntroPage/>}/>
            <Route path="/login" element={<LoginPage toggleCookieBanner={toggleCookieBanner}/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            <Route path="/verify-email" element={<VerifyEmailPage/>}/>
            <Route path="/menu/:id" element={<MenuPage />} />
            <Route path="/addreview" element={<RatingPage/>}/>
            <Route path="/" element={<RestoPage/>}/>
            <Route path="/reviews" element={<ViewRatingPage/>}/>
            <Route path="/about-us" element={<AboutUsPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/account-recovery" element={<ResetPassword/>}/>
            <Route path="/feature-request" element={<FeatureRequest/>}> </Route>
            <Route path="/support" element={<UserSupportPage/>}></Route>
            <Route path="/account-recovery" element={<ResetPassword/>}></Route>
            <Route path="/payment-success" Component={PaymentSuccessPage}/>
            <Route path="/payment-failed" Component={PaymentFailedPage}/>
            <Route path="/login-success" element={<LoginSuccess/>}/>
            <Route path="/change-password" element={<ChangePasswordPage/>}></Route>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MVPRouter;
