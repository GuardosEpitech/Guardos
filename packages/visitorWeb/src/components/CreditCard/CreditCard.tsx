import React, { useState } from 'react';
import styles from './CreditCard.module.scss';
import DeleteIcon from "@mui/icons-material/Delete";
import {useTranslation} from "react-i18next";

interface ICreditCardProps {
  name: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  id: string;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const CreditCard: React.FC<ICreditCardProps> = (props: ICreditCardProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { name, brand, last4, exp_month, exp_year, id, onDelete, onUpdate } = props;
  const {t} = useTranslation();

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  async function handleConfirmDelete() {
    await onDelete(id);
    if (onUpdate) {
      setShowDeleteConfirmation(false);
      await onUpdate();
    }
  };

  return (
    <div className={styles.creditCard}>
      <div className={styles.menu} onClick={handleDeleteConfirmation}>
        <div className={styles.menuIcon}>
          <DeleteIcon fontSize='small'/>
        </div>
      </div>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.cardNumber}>
        {[...Array(3)].map((_, index) => (
          <span key={index}>
            {'****'}
            {'\u00A0'}
          </span>
        ))}
        <span className={styles.last4}>{last4}</span>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.name}>{name}</div>
        <div className={styles.expiresOn}>
          {t('components.CreditCard.expire')}{('0' + exp_month).slice(-2)}/{String(exp_year).slice(-2)}
        </div>
      </div>
      {showDeleteConfirmation && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>{t('components.CreditCard.msg')}</p>
            <div>
              <button onClick={handleConfirmDelete}>{t('common.confirm')}</button>
              <button onClick={handleDeleteCancel}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCard;
