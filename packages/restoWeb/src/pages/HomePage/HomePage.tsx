import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FixedBtn from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import { getAllRestaurantsByUserAndFilter } from "@src/services/restoCalls";
import { NavigateTo } from "@src/utils/NavigateTo";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import Layout from 'shared/components/Layout/Layout';
import RestoCard from "@src/components/RestoCard/RestoCard";
import AdCard from "@src/components/AdCard/AdCard";
import styles from "./HomePage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { getRestoUserPermission } from '@src/services/permissionsCalls';

const HomePage = () => {
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [isUserTokenSet, setIsUserTokenSet] = useState<boolean>(false);
  const [adIndex, setAdIndex] = useState<number | null>(null);  // State to store the random index
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState<boolean>(false);

  useEffect(() => {
    updateRestoData("");
  }, []);

  document.addEventListener('loggedOut', function() {
    setRestoData([]);
    setIsUserTokenSet(false);
  });

  const getPremium = async () => {
    try {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        setIsUserTokenSet(false);
        return;
      }
      const permissions = await getRestoUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      const isBasicUser = permissions.includes('basicSubscription');
      if (isPremiumUser || isBasicUser) {
        setPremium(true);
      } else {
        setPremium(false);
      }
    } catch (error) {
      console.error("Error getting permissions: ", error);
    }
  };

  useEffect(() => {
    getPremium();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value;
    setSearchFilter(newFilter);
    updateRestoData(newFilter);
  };

  const updateRestoData = (filter: string) => {
    setLoading(true);
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
        setAdIndex(Math.floor(Math.random() * (res.length + 1)));  // Set a random index for AdCard
      });
    setLoading(false);
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
              <p>{t('pages.HomePage.no-restos-yet')}</p>
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
            {loading ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" width={1000} height={130} />
                <Skeleton variant="rounded" width={1000} height={130} />
                <Skeleton variant="rounded" width={1000} height={130} />
              </Stack>
            ) : (
              restoData.map((restaurant, index) => (
                <React.Fragment key={restaurant.name + index}>
                  {index === adIndex && <AdCard />}
                  <RestoCard
                    resto={restaurant as IRestaurantFrontEnd}
                    onUpdate={updateRestoData}
                    editable
                  />
                </React.Fragment>
              ))
            )}
            {!premium && restoData.length === adIndex && <AdCard />}
          </div>
        </div>
      </Layout>
      {isUserTokenSet && (
        <FixedBtn title={t('pages.HomePage.add-resto')} redirect="/addResto" />
      )}
      <SuccessAlert objectName={t('components.DishForm.resto')}/>
    </div>
  );
};

export default HomePage;
