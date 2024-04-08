import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FixedBtn
  from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import { getAllRestaurantsByUser } from "@src/services/restoCalls";
import { NavigateTo } from "@src/utils/NavigateTo";
import {IRestaurantFrontEnd} from "shared/models/restaurantInterfaces";
import Layout from 'shared/components/Layout/Layout';
import RestoCard from "@src/components/RestoCard/RestoCard";
import styles from "./HomePage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";
import { enable, disable, setFetchMethod } from "darkreader";


const HomePage = () => {
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(Boolean(localStorage.getItem('darkMode')));

  useEffect(() => {
    updateRestoData();
    toggleDarkMode();
  }, []);

  const updateRestoData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      setIsUserTokenSet(false);
      return;
    }
    setIsUserTokenSet(true);
    getAllRestaurantsByUser({ key: userToken })
      .then((res) => {
        setRestoData(res);
      });
  };

  document.addEventListener('loggedOut', function( ) {
    setRestoData([]);
    setIsUserTokenSet(false);
  });

  const toggleDarkMode = () => {
    console.log(isDarkMode);
      
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
  };

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My Restaurants</span>
      </div>
      <Layout>
        <div className={styles.DivContent}>
          <div>
            { isUserTokenSet && restoData.length === 0 && (
              <p>
                You have currently no active restaurant. You can click on
                the button in thelower right corner to add a new one.
              </p>
            )}
            { !isUserTokenSet && (
              <p>
                Please <a onClick={() => NavigateTo('/login', navigate, {})}>
                  Login
                </a> to see your restaurants
              </p>
            )}
            {restoData.map((restaurant, index) => {
              return (
                <RestoCard
                  key={restaurant.name + index}
                  resto={restaurant as IRestaurantFrontEnd}
                  onUpdate={updateRestoData}
                  editable
                />
              );
            })}
          </div>
        </div>
      </Layout>
      { isUserTokenSet && (
        <FixedBtn title="Add Restaurant" redirect="/addResto" />
      )}
      <SuccessAlert />
    </div>
  );
};

export default HomePage;
