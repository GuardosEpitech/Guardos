import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IDishFE } from "shared/models/dishInterfaces";
import styles from "@src/pages/DiscountDishPage/DiscountDishPage.module.scss";
import { useTranslation } from "react-i18next";
import { checkDarkMode } from "../../utils/DarkMode";
import DatePicker from 'react-datepicker'; // Ensure react-datepicker is installed
import 'react-datepicker/dist/react-datepicker.css';
import { addDiscount, removeDiscount } from "@src/services/dishCalls";
import { parse } from 'date-fns';

const parseDateString = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  const fullYear = year < 100 ? 2000 + year : year; 
  return new Date(fullYear, month - 1, day); 
};

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

interface IDiscountDishPageProps {
  dish: IDishFE;
}

const DiscountDishPage: React.FC<IDiscountDishPageProps> = () => {
  const { dish } = useLocation().state as IDiscountDishPageProps;
  const { name, uid, products, description, price, allergens, resto,
    category, picturesId, discount, validTill }
    = dish;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [discountType, setDiscountType] = useState<'percent' | 'price'>('percent');
  const [discountValue, setDiscountValue] = useState<number | string>(discount !== -1 ? discount : '');
  const [startDate, setStartDate] = useState<Date | null>(() => {
    if (validTill) {
      try {
        const parsedDate = parseDateString(validTill);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      } catch (error) {
        console.error('Error parsing date:', error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    checkDarkMode();

    if (discount !== -1 && discountType === 'percent') {
      const percentage = (discount / price) * 100;
      setDiscountValue(percentage.toFixed(2));
    }
  }, [discount, discountType, price]);

  const handleToggleDiscountType = () => {
    setDiscountType(prevType => {
      const newType = prevType === 'percent' ? 'price' : 'percent';
      if (newType === 'price') {
        const priceDiscount = (parseFloat(discountValue as string) / 100) * price;
        setDiscountValue(priceDiscount.toFixed(2));
      } else {
        const percentage = (parseFloat(discountValue as string) / price) * 100;
        setDiscountValue(percentage.toFixed(2));
      }
      return newType;
    });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountValue(e.target.value);
  };

  const handleDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleSave = async () => {
    if (!discountValue || !startDate) {
      return;
    }

    if (discountType === 'percent') {
      const discountPercent = parseFloat(discountValue as string);
      const discountPrice = (discountPercent / 100) * price;
      dish.discount = parseFloat(discountPrice.toFixed(2));
    } else {
      dish.discount = parseFloat(discountValue as string);
    }
    dish.validTill = formatDate(startDate);

    const userToken = localStorage.getItem('user');
    try {
      await addDiscount({ restoName: resto, dish }, userToken);
      navigate('/dishes');
    } catch (error) {
      console.error('Failed to save discount', error);
    }
  };

  const handleRemove = async () => {
    const userToken = localStorage.getItem('user');
    dish.discount = -1;
    dish.validTill = "";
    try {
      await removeDiscount({ restoName: resto, dish }, userToken);
      navigate('/dishes'); 
    } catch (error) {
      console.error('Failed to remove discount', error);
    }
  };

  return (
    <div>
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>{t('pages.DiscountDishPage.title')}</span>
      </div>
      <div className={styles.container}>
        <h2 className={styles.title}>{name}</h2>
        <button className={styles.button} onClick={handleToggleDiscountType}>
          {discountType === 'percent' ? t('pages.DiscountDishPage.switchPrice') : t('pages.DiscountDishPage.switchPercent')}
        </button>
        <input
          type="text"
          value={discountValue}
          onChange={handleDiscountChange}
          placeholder={discountType === 'percent' ? t('pages.DiscountDishPage.enterPercent') : t('pages.DiscountDishPage.enterPrice')}
          className={styles.input}
        />
        <div className={styles.datepicker}>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText={t('pages.DiscountDishPage.valid')}
            className={styles.input}
          />
        </div>
        <button className={styles.saveButton} onClick={handleSave}>{t('common.save')}</button>
        {discount !== -1 && <button className={styles.removeButton} onClick={handleRemove}>{t('common.delete')}</button>}
      </div>
    </div>
  );
};

export default DiscountDishPage;
