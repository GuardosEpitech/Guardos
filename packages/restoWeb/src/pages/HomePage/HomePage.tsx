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
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const HomePage = () => {
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  useEffect(() => {
    updateRestoData();
    checkDarkMode();
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

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-restos')}</span>
      </div>
      <Layout>
        <div className={styles.DivContent}>
          <div>
            { isUserTokenSet && restoData.length === 0 && (
              <p>
                {t('pages.HomePage.no-restos-yet')}
              </p>
            )}
            { !isUserTokenSet && (
              <p>
                {t('pages.HomePage.please')}
                <a onClick={() => NavigateTo('/login', navigate, {})}>
                  {t('pages.HomePage.login')}
                </a>
                {t('pages.HomePage.to-see-your-restos')}
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
        <FixedBtn title={t('pages.HomePage.add-resto')} redirect="/addResto" />
      )}
      <SuccessAlert />
    </div>
  );
};

export default HomePage;
