import React, { useEffect, useState } from "react";

import FixedBtn
  from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import { getAllResto } from "@src/services/restoCalls";
import {IRestaurantFrontEnd} from "@src/model/restaurantInterfaces";
import Header from "@src/components/dumpComponents/Header/Header";
import Layout from "@src/components/dumpComponents/Layout/Layout";
import RestoCard from "@src/components/RestoCard/RestoCard";
import styles from "./HomePage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";

const HomePage = () => {
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);

  useEffect(() => {
    updateRestoData();
  }, []);

  const updateRestoData = () => {
    getAllResto()
      .then((res) => {
        setRestoData(res);
      });
  };

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My Restaurants</span>
      </div>
      <Layout>
        <div className={styles.DivContent}>
          <div>
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
      <FixedBtn title="Add Restaurant" redirect="/addResto" />
      <SuccessAlert />
    </div>
  );
};

export default HomePage;
