import React from "react";
import styles from "./SubscriptionBox.module.scss";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";

interface SubscriptionBoxProps {
  title: string;
  description: string[];
  price: string;
  onClick: (permissions: string[]) => Promise<void>;
  isActive: boolean;
  permission: string;
  onDelete?: (permissions: string[]) => Promise<void>;
}

const SubscriptionBox: React.FC<SubscriptionBoxProps> = ({ title, description,
                                                           price, onClick, isActive, permission, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div
      className={
        `${styles.subscriptionCard} ${isActive ? styles.highlighted : ""}`
      }
    >
      {(isActive && onDelete) && (
        <div
          className={styles.deleteIcon}
          onClick={() => onDelete([permission])}
        >
          <CancelIcon />
        </div>
      )}
      <h2>{title}</h2>
      <ul className={styles.descriptionList}>
        {description.map((desc, index) => (
          <li key={index}>{desc}</li>
        ))}
      </ul>
      <div className={styles.priceContainer}>
        <div className={styles.smallFont}>
          {t('components.SubscriptionBox.monthly-price')}
        </div>
        <div className={styles.bigFont}>{price}</div>
      </div>
      <button
        onClick={() => onClick([permission])}
      >
        {t('components.SubscriptionBox.select')}
      </button>
    </div>
  );
};

export default SubscriptionBox;
