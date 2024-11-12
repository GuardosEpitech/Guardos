import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IDishFE } from "shared/models/dishInterfaces";
import styles from "@src/pages/DishComboPage/DishComboPage.module.scss";
import { useTranslation } from "react-i18next";
import { getDishesByResto } from "@src/services/dishCalls";
import {
    Autocomplete,
    Grid,
    TextField,
  } from "@mui/material";
import { addCombo, removeCombo } from "@src/services/dishCalls";

interface IDishComboPageProps {
  dish: IDishFE;
}

const DishComboPage = () => {
    const { dish } = useLocation().state as IDishComboPageProps;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dishes, setDishes] = useState<IDishFE[]>([]);
    const [selectedDishes, setSelectedDishes] = useState<IDishFE[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchDishes = async () => {
        const allDishes = await getDishesByResto(dish.resto);
        const cleanedDishes = allDishes[0].dishes.filter((d: IDishFE) => d.name !== dish.name);
        const selected: IDishFE[] = [];
        if (dish.combo && dish.combo.length > 0) {
          cleanedDishes.forEach((d: IDishFE) => {
            if (dish.combo.includes(d.uid)) {
              selected.push(d);
            }
          });
        }
        setDishes(cleanedDishes);
        setSelectedDishes(selected);
      };
    fetchDishes();
  }, [dish.resto]);

  const handleSelectDish = (event: any, newSelectedDishes: IDishFE[]) => {
    setSelectedDishes(newSelectedDishes);
  };

  const handleSave = async () => {
    const userToken = localStorage.getItem('user');
    if (selectedDishes.length < 1) {
        const newDish = await removeCombo(userToken, {restoName: dish.resto, dish: dish});
        setSuccessMessage(t('pages.DishComboPage.successRemove'));
        setTimeout(() => {
            navigate('/dishes'); 
        }, 1500);  
    } else {
        const selectedUids = selectedDishes.map((dish) => dish.uid);
        const newDish = await addCombo(userToken, {restoName: dish.resto, dish: dish, combo: selectedUids});
        setSuccessMessage(t('pages.DishComboPage.successAdd'));
        setTimeout(() => {
            navigate('/dishes'); 
        }, 1500);
    }
  };

  const handleClear = () => {
    setSelectedDishes([]);
  };

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>
          {t('pages.DishComboPage.title', { productName: dish.name })}
        </span>
      </div>

      <div className={styles.container}>
        <h2>{t('pages.DishComboPage.recommendedCombinations')}</h2>

        <Grid item xs={12} sm={12} md={12}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={dishes}
            getOptionLabel={(option) => option.name}
            value={selectedDishes}
            filterSelectedOptions
            onChange={handleSelectDish}
            sx={{ minWidth: 300, marginBottom: 5 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('pages.DishComboPage.selectDish')}
                required
              />
            )}
          />
        </Grid>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <div className={styles.buttonContainer}>
          <button onClick={handleSave}>
            {t('pages.DishComboPage.save')}
          </button>
          <button onClick={handleClear}>
            {t('pages.DishComboPage.clearAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishComboPage;
