import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FixedBtn
  from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import {getAllRestaurantsByUserAndFilter} from "@src/services/restoCalls";
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
  const [searchFilter, setSearchFilter] = useState<string>('');


  useEffect(() => {
    updateRestoData("");
    checkDarkMode();
  }, []);
  document.addEventListener('loggedOut', function( ) {
    setRestoData([]);
    setIsUserTokenSet(false);
  });


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value;
    setSearchFilter(newFilter);  
    updateRestoData(newFilter);
  };
  
  const updateRestoData = (filter: string) => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      setIsUserTokenSet(false);
      return;
    }
    setIsUserTokenSet(true);
    if (filter === undefined) {
      filter = "";
    }
    getAllRestaurantsByUserAndFilter(userToken, filter)
      .then((res) => {
        setRestoData(res);
      });
  };

  useEffect(() => {
    updateRestoData(searchFilter);
  }, []);

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-restos')}</span>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder={t('pages.HomePage.search-restos')}
          value={searchFilter}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <Layout>
        <div className={styles.DivContent}>
          <div>
            {isUserTokenSet && restoData.length === 0 && (
              <p>
                {t('pages.HomePage.no-restos-yet')}
              </p>
            )}
            {!isUserTokenSet && (
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
      {isUserTokenSet && (
        <FixedBtn title={t('pages.HomePage.add-resto')} redirect="/addResto"/>
      )}
      <SuccessAlert/>
    </div>
  );
};

export default HomePage;
