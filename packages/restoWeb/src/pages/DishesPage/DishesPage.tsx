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
import {useTranslation} from "react-i18next";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {NavigateTo} from "@src/utils/NavigateTo";
import {useNavigate} from "react-router-dom";

const DishesPage = () => {
  const [dishData, setDishData] = useState<Array<IDishFE>>([]);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    updateDishData();
  }, []);

  const updateDishData = () => {
    setLoading(true);
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getDishesByUser({ key: userToken })
      .then((res) => {
        setDishData(res);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('common.my-dishes')}</span>
      </div>
      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" style={{marginLeft: "20%",
            marginTop: "20px"}} width={1000} height={130} />
          <Skeleton variant="rounded" style={{marginLeft: "20%"}} 
            width={1000} height={130} />
          <Skeleton variant="rounded" style={{marginLeft: "20%"}} 
            width={1000} height={130} />
        </Stack>
      ) : (
        <>
          <Layout>
            {dishData.length === 0 ?
              (<div className={styles.ErrorContainer}>
                <span className={styles.ErrorHeader}>
                  {t('pages.DishesPage.no-dishes-yet')}
                </span>
                <br/>
                <br/>
                <br/>
                <span className={styles.ErrorText}>
                  {t('pages.DishesPage.add-first-dish')}
                  <a onClick={() => { navigate('/addDish'); }}>{t('pages.DishesPage.here')}</a>.
                </span>
                <br/>
                <span className={styles.ErrorText}>
              Be sure to <a onClick={() => { navigate('/addResto'); }}>add</a> a restaurant first.
                </span>
              </div>)
              :
              (dishData.map((dish, index) => {
                return (
                  <Dish
                    key={dish.name + index}
                    dish={dish}
                    onUpdate={updateDishData}
                    editable
                    isTopLevel={true}
                  />
                );
              })
              )}
          </Layout>
          <FixedBtn title={t('pages.DishesPage.add-dish')} redirect="/addDish"/>
          <SuccessAlert objectName={t('common.dish')} />
        </>
      )}
    </div>
  );
};

export default DishesPage;
