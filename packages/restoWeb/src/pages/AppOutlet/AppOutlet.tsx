import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/dumpComponents/Header/Header";
import { enable, disable, setFetchMethod } from "darkreader";

const AppOutlet = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    toggleDarkMode();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  
    if (!isDarkMode) {
      setFetchMethod((url) => {
        return fetch(url, {
          mode: 'no-cors',
        });
      });
      enable({
        brightness: 100,
        contrast: 100,
        darkSchemeBackgroundColor: '#181a1b',
        darkSchemeTextColor: '#e8e6e3'
      });
    } else {
      disable();
    }
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  return (
    <div className={styles.ParentElement}>
      <div className={styles.ContentElement}>
        <Header/>
        <Outlet />
      </div>
      <div className={styles.Container}>
        <div className={styles.TextContainer}>
          <h2 className={styles.ContactTitle}>Contact:</h2>
          <ul className={styles.ListContact}>
            <li>Email: contact@guardos.com</li>
            <li>Phone: +49 211 1234567</li>
            <li>Location: contact@guardos.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppOutlet;
