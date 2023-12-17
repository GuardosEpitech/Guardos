import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./AppOutlet.module.scss";
import Header from "@src/components/dumpComponents/Header/Header";

const AppOutlet = () => {
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
