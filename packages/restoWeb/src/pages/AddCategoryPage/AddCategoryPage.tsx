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
          // If category name already exists, do nothing
          return;
        }
      
        let updatedCategories = [...newCategories];
      
        const existingSortIdIndex = updatedCategories.findIndex(category => category.hitRate === Number(newCategoryHitRate));
        if (existingSortIdIndex !== -1) {
          // If sort ID already exists, increase sort ID of existing entry and following entries
          updatedCategories = updatedCategories.map(category => {
            if (category.hitRate >= Number(newCategoryHitRate)) {
              return { ...category, hitRate: category.hitRate + 1 };
            }
            return category;
          });
        }
      
        // Add new category with the updated sort ID
        const newCategory = { name: newCategoryName, hitRate: Number(newCategoryHitRate) };
        updatedCategories.push(newCategory);
      
        // Sort categories based on hitRate
        updatedCategories.sort((a, b) => a.hitRate - b.hitRate);
        const updatedResto = await updateRestoCategories(userToken, activeRestaurant, updatedCategories);
        // Update state
        setNewCategories(updatedCategories);
        setNewCategoryName('');
        setNewCategoryHitRate('');
        setShowNewCategoryInput(false);
      };
  
    return (
        <div className={styles['create-categories-page']}>
        <select value={activeRestaurant} onChange={handleRestaurantChange}>
          {restoData.map((restaurant) => (
            <option key={restaurant.uid} value={restaurant.uid}>{restaurant.name}</option>
          ))}
        </select>
        {activeRestaurant !== -1 && (
          <div className={styles['category-containers']}>
            {newCategories.map((category, index) => (
              <div key={index} className={styles['category-container']}>
                <div>{t('pages.AddCategory.name')} {category.name}</div>
                <div>{t('pages.AddCategory.id')} {category.hitRate}</div>
              </div>
            ))}
            {showNewCategoryInput && (
              <div className={styles['category-container']}>
                <input
                    type="text"
                    placeholder={t('pages.AddCategory.name')}
                    value={newCategoryName}
                    onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setNewCategoryNameError(false); // Reset error when user types
                    }}
                    style={{ borderColor: newCategoryNameError ? 'red' : '' }} // Add style for red border
                />

                    <input
                    type="number"
                    placeholder={t('pages.AddCategory.id')}
                    value={newCategoryHitRate}
                    onChange={(e) => {
                        setNewCategoryHitRate(parseInt(e.target.value));
                        setNewCategoryHitRateError(false); // Reset error when user types
                    }}
                    style={{ borderColor: newCategoryHitRateError ? 'red' : '' }} // Add style for red border
                    />
                <button onClick={handleSaveCategory}>{t('common.save')}</button>
              </div>
            )}
            {!showNewCategoryInput && (
              <div className={styles['add-new-category-btn-container']}>
                <button onClick={handleAddNewCategory}>{t('pages.AddCategory.add')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default AddCategoryPage;
