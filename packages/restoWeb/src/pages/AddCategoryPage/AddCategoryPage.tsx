import React, { useState, useEffect } from 'react';
import { ICategories } from '../../../../shared/models/categoryInterfaces';
import { IRestaurantFrontEnd } from 'shared/models/restaurantInterfaces';
import { getAllRestaurantsByUser, updateRestoCategories } from '@src/services/restoCalls';
import styles from './AddCategoriyPage.module.scss';
import {useTranslation} from "react-i18next";

const AddCategoryPage = () => {
    const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
    const [activeRestaurant, setActiveRestaurant] = useState<number>(-1);
    const [newCategories, setNewCategories] = useState<{ name: string; hitRate: number }[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryHitRate, setNewCategoryHitRate] = useState<number | ''>('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryNameError, setNewCategoryNameError] = useState(false);
    const [newCategoryHitRateError, setNewCategoryHitRateError] = useState(false);
    const {t} = useTranslation();
  
    useEffect(() => {
      async function fetchRestaurants() {
        try {
          const userToken = localStorage.getItem('user');
          const restaurants = await getAllRestaurantsByUser({ key: userToken });
          setRestoData(restaurants);
          setActiveRestaurant(restaurants.length > 0 ? restaurants[0].uid : -1);
          updateNewCategories(restaurants.length > 0 ? restaurants[0].categories : []);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
        }
      }
      fetchRestaurants();
    }, []);
  
    const updateNewCategories = (categories: ICategories[]) => {
      const formattedCategories: { name: string; hitRate: number }[] = categories.map(category => ({
        name: category.name,
        hitRate: category.hitRate
      }));
      formattedCategories.sort((a, b) => a.hitRate - b.hitRate);
      setNewCategories(formattedCategories);
    };
  
    const handleRestaurantChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedRestaurantId = parseInt(event.target.value);
      setActiveRestaurant(selectedRestaurantId);
      const selectedRestaurant = restoData.find(restaurant => restaurant.uid === selectedRestaurantId);
      if (selectedRestaurant) {
        updateNewCategories(selectedRestaurant.categories.sort((a, b) => a.hitRate - b.hitRate));
      } else {
        setNewCategories([]);
      }
    };

    const handleAddNewCategory = () => {
        setShowNewCategoryInput(true);
    };
  
    const handleSaveCategory = async () => {
        if (newCategoryName.trim() === '' || newCategoryHitRate === '') {
          if (newCategoryName.trim() === '') {
            setNewCategoryNameError(true);
          }
          if (newCategoryHitRate === '') {
            setNewCategoryHitRateError(true);
          }
          return;
        }
        setNewCategoryNameError(false);
        setNewCategoryHitRateError(false);

        const userToken = localStorage.getItem('user');
        if (userToken === null) {
            console.log("Error getting user ID");
            return;
        }
      
        const existingCategory = newCategories.find(category => category.name.toLowerCase() === newCategoryName.toLowerCase());
        if (existingCategory) {
          return;
        }
      
        let updatedCategories = [...newCategories];
      
        const existingSortIdIndex = updatedCategories.findIndex(category => category.hitRate === Number(newCategoryHitRate));
        if (existingSortIdIndex !== -1) {
          updatedCategories = updatedCategories.map(category => {
            if (category.hitRate >= Number(newCategoryHitRate)) {
              return { ...category, hitRate: category.hitRate + 1 };
            }
            return category;
          });
        }
      
        const newCategory = { name: newCategoryName, hitRate: Number(newCategoryHitRate) };
        updatedCategories.push(newCategory);
      
        updatedCategories.sort((a, b) => a.hitRate - b.hitRate);
        const updatedResto = await updateRestoCategories(userToken, activeRestaurant, updatedCategories);
        setNewCategories(updatedCategories);
        setNewCategoryName('');
        setNewCategoryHitRate('');
        setShowNewCategoryInput(false);
      };
  
    return (
      <div className={styles.categoriesContainer}>
        <div className={styles.createCategoriesPage}>
          {restoData.length === 0 ?
        (
          <div className={styles.ErrorContainer}>
            <span className={styles.ErrorHeader}>
              {t('pages.AddCategory.noresto')}
            </span>
            <br/>
            <br/>
            <br/>
            <span className={styles.ErrorText}>
              {t('pages.AddCategory.noresto2')} 
              <a href="/addResto">{t('pages.AddCategory.noresto2-2')}</a>
              {t('pages.AddCategory.noresto2-3')}
            </span>
            <br/>
          </div>
        ) : (
        <select value={activeRestaurant} onChange={handleRestaurantChange}>
          {restoData.map((restaurant) => (
            <option key={restaurant.uid} value={restaurant.uid}>{restaurant.name}</option>
          ))}
        </select>
        )}
        {activeRestaurant !== -1 && (
          <div className={styles.categoryContainers}>
            {newCategories.map((category, index) => (
              <div key={index} className={styles.categoryContainer}>
                <div>{t('pages.AddCategory.name')} {category.name}</div>
                <div>{t('pages.AddCategory.id')} {category.hitRate}</div>
              </div>
            ))}
            {showNewCategoryInput && (
              <div className={styles.categoryContainer}>
                <input
                    type="text"
                    placeholder={t('pages.AddCategory.name')}
                    value={newCategoryName}
                    onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setNewCategoryNameError(false); 
                    }}
                    style={{ borderColor: newCategoryNameError ? 'red' : '' }} 
                />

                    <input
                    type="number"
                    placeholder={t('pages.AddCategory.id')}
                    value={newCategoryHitRate}
                    onChange={(e) => {
                        setNewCategoryHitRate(parseInt(e.target.value));
                        setNewCategoryHitRateError(false); 
                    }}
                    style={{ borderColor: newCategoryHitRateError ? 'red' : '' }} 
                    />
                <button onClick={handleSaveCategory}>{t('common.save')}</button>
              </div>
            )}
            {!showNewCategoryInput && (
              <div className={styles.addNewCategoryBtnContainer}>
                <button onClick={handleAddNewCategory}>{t('pages.AddCategory.add')}</button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    );
  };

export default AddCategoryPage;
