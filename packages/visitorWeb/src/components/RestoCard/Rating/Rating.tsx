import React, { useState } from "react";
import styles from "@src/components/RestoCard/Rating/Rating.module.scss";
import { NavigateTo } from "@src/utils/NavigateTo";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getRatingData } from "@src/services/ratingCalls";
import Rating from '@mui/material/Rating';
import {useTranslation} from "react-i18next";

interface IRatingProps {
  restoRating: number,
  restoRatingsCount: number,
  restoName: string
}

const RatingDisplay = ({ restoRating, restoRatingsCount, restoName }: IRatingProps) => {
  const navigate = useNavigate();
  const [ratingData, setRatingData] = React.useState([]);
  const {t} = useTranslation();

  const averageRating = () => {
    let sum = 0;
    if (Array.isArray(ratingData)) {
      ratingData.forEach((data) => {
        if (data.note === undefined) {
          sum += 0;
        } else {
          sum += data.note;
        }
      });
      return parseFloat((sum / ratingData.length).toFixed(1));
    } else {
      return sum;
    }
  };

  useState(() => {
    getRatingData(restoName).then(res => setRatingData(res));
  })

  return (
    <div className={styles.ReviewContainer}>
      <Button
          onClick={() => NavigateTo("/reviews", navigate, {
            restoName: restoName,
          })}
      >
        <Rating name="read-only" value={averageRating()} readOnly />
      </Button>
      <span className={styles.AverageTxt}>{Array.isArray(ratingData) ? ratingData.length : 0}</span>
      <Button
        className={styles.AddReview}
        variant="contained"
        onClick={() => NavigateTo("/addreview", navigate, {
          restoName: restoName,
        })}
        >
        {t('components.RestoCard.add-review')}
      </Button>
    </div>
  );
};

export default RatingDisplay;
