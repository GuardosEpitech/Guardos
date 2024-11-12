import React, { useState, useEffect } from "react";
import "./App.css";
import MVPRouter from "./router/Router";
import "../i18n/i18n";
import { checkDarkMode } from "./utils/DarkMode";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading screen on route change
    setLoading(true);
    // Simulate loading time, remove loading screen once route loads
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust delay as needed
    checkDarkMode();
    // Cleanup timer on component unmount or route change
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {loading && <LoadingScreen />}
      <div className="App">
        <MVPRouter />
      </div>
    </>
  );
}

export default App;
