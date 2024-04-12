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
import {useTranslation} from "react-i18next";

const DishesPage = () => {
  const [dishData, setDishData] = useState<Array<IDishFE>>([]);
  const {t} = useTranslation();

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
        <span className={styles.TitleSearch}>{t('common.my-dishes')}</span>
      </div>
      <Layout>
        {dishData.length === 0 ?
          (<div>
            <span className={styles.ErrorHeader}>
              {t('pages.DishesPage.no-dishes-yet')}
            </span>
            <br/>
            <br/>
            <br/>
            <span className={styles.ErrorText}>
              {t('pages.DishesPage.add-first-dish')}
              <a href="/addDish">{t('pages.DishesPage.here')}</a>.
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
      <FixedBtn title={t('pages.DishesPage.add-dish')} redirect="/addDish"/>
      <SuccessAlert/>
    </div>
  );
};

export default DishesPage;
