import React, { useEffect, useState } from "react";
import styles from "@src/components/RestoCard/Rating/Rating.module.scss";
import { NavigateTo } from "@src/utils/NavigateTo";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getRatingData } from "@src/services/ratingCalls";
import Rating from '@mui/material/Rating';
import { useTranslation } from "react-i18next";

interface IRatingProps {
  restoRating: number;
  restoRatingsCount: number;
  restoName: string;
  isPopup?: boolean;
}

const RatingDisplay = ({ restoRating, restoRatingsCount, restoName, isPopup }: IRatingProps) => {
  const navigate = useNavigate();
  const [ratingData, setRatingData] = React.useState([]);
  const { t } = useTranslation();

  const averageRating = () => {
    let sum = 0;
    if (Array.isArray(ratingData)) {
      ratingData.forEach((data) => {
        sum += data.note || 0;
      });
      return parseFloat((sum / ratingData.length).toFixed(1));
    }
    return sum;
  };

  useEffect(() => {
    getRatingData(restoName).then(res => setRatingData(res));
  }, [restoName]);

  return (
    <div className={`${isPopup ? styles.PopupContainer : styles.ReviewContainer}`}>
      <div className={styles.RatingRow}>
        <Button onClick={() => NavigateTo("/reviews", navigate, { restoName: restoName })}>
          <Rating name="read-only" value={averageRating()} readOnly />
        </Button>
        <span className={styles.AverageTxt}>
          {Array.isArray(ratingData) ? ratingData.length : 0}
        </span>
      </div>
      <Button
        className={styles.AddReview}
        variant="contained"
        onClick={() => NavigateTo("/addreview", navigate, { restoName: restoName })}
      >
        {t("components.RestoCard.add-review")}
      </Button>
    </div>
  );
};

export default RatingDisplay;
