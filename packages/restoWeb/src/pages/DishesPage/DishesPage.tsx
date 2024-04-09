import React, {useEffect, useState} from "react";

import Dish from "@src/components/menu/Dish/Dish";
import FixedBtn
  from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import {getDishesByUser} from "@src/services/dishCalls";
import {IDishFE} from "shared/models/dishInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/DishesPage/DishesPage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";
import { enable, disable, setFetchMethod} from "darkreader";



const DishesPage = () => {
  const [dishData, setDishData] = useState<Array<IDishFE>>([]);

  useEffect(() => {
    updateDishData();
    checkDarkMode();
  }, []);

  const updateDishData = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getDishesByUser({ key: userToken })
      .then((res) => {
        setDishData(res);
      });
  };

  const checkDarkMode = () => {
    if ((localStorage.getItem('darkMode')) == 'true'){
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
    },);
    } else {
      disable();
    }
  }

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>My dishes</span>
      </div>
      <Layout>
        {dishData.length === 0 ?
          (<div>
            <span className={styles.ErrorHeader}>
              Oops, looks like you dont have any dishes yet!
            </span>
            <br/>
            <br/>
            <br/>
            <span className={styles.ErrorText}>
              Add your first dish by clicking <a href="/addDish">here</a>.
            </span>
          </div>)
          :
          (dishData.map((dish, index) => {
            console.log("Dish: ", dish);
            return (
              <Dish
                key={dish.name + index}
                dish={dish}
                onUpdate={updateDishData}
                editable
              />
            );
          })
          )}
      </Layout>
      <FixedBtn title="Add dish" redirect="/addDish"/>
      <SuccessAlert/>
    </div>
  );
};

export default DishesPage;
