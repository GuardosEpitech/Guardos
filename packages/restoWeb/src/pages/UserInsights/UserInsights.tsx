import React, { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import styles from "@src/pages/ProductsPage/ProductsPage.module.scss";

import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";
import {getRestoStatistics} from "@src/services/statisticsCalls";
import {getAllRestaurantsByUser} from "@src/services/restoCalls";

const UserInsights = () => {
  const {t} = useTranslation();
  
  //get statistics for user
  const [userStatistics, setUserStatistics] = useState({
    totalClicks: 0,
    clicksThisMonth: 0,
    clicksThisWeek: 0,
    updateMonth: "",
    updateWeek: "",
    userDislikedIngredients: [],
    userAllergens: [],
  });

  const getStatistics = async () => {
    try {
      const userToken = localStorage.getItem('user');
      const response = await getRestoStatistics(userToken);
      const restaurants = await getAllRestaurantsByUser({key: userToken});
      console.log(restaurants);
      console.log(response);
    }
    catch (error) {
      console.error("Error fetching the statistics:", error);
    }
  };

  useEffect(() => {
    checkDarkMode();
    getStatistics();
  }, []);

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-analytics')}</span>
      </div>
    </div>
  );
};

export default UserInsights;
