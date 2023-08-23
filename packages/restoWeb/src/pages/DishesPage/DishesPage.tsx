import React, {useEffect, useState} from "react";

import Dish from "@src/components/menu/Dish/Dish";
import FixedBtn
  from "@src/components/dumpComponents/buttons/FixedBtn/FixedBtn";
import {getAllDishes} from "@src/services/dishCalls";
import Header from "@src/components/dumpComponents/Header/Header";
import {IDishFE} from "shared/models/dishInterfaces";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/DishesPage/DishesPage.module.scss";
import SuccessAlert
  from "@src/components/dumpComponents/SuccessAlert/SuccessAlert";

const DishesPage = () => {
  const [dishData, setDishData] = useState<Array<IDishFE>>([]);

  useEffect(() => {
    updateDishData();
  }, []);

  const updateDishData = () => {
    getAllDishes()
      .then((res) => {
        setDishData(res);
      });
  };

  return (
    <div>
      <Header/>
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
