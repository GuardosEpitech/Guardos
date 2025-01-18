import React, { useEffect } from "react";
import styles from "@src/components/RestoCard/Rating/Rating.module.scss";
import { NavigateTo } from "@src/utils/NavigateTo";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getRatingData } from "@src/services/ratingCalls";
import Rating from '@mui/material/Rating';
import { useTranslation } from "react-i18next";

interface IRatingProps {
  restoRating: number,
  restoRatingsCount: number,
  restoName: string,
  isPopup?: boolean,
  restoID: number
}

const RatingDisplay = ({ restoRating, restoRatingsCount, restoName, restoID, isPopup }: IRatingProps) => {
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
    getRatingData(restoID).then(res => setRatingData(res));
  }, [restoID]);

  return (
    <div className={`${isPopup ? styles.PopupContainer : styles.ReviewContainer}`}>
      <div className={styles.RatingRow}>
        <Button
            onClick={() => NavigateTo("/reviews", navigate, {
              restoName: restoName,
              restoID: restoID
            })}
        >
          <Rating name="read-only" value={averageRating()} readOnly />
        <span className={styles.AverageTxt}>
          {Array.isArray(ratingData) ? ratingData.length : 0}
        </span>
        </Button>
      </div>
      <Button
        className={styles.AddReview}
        variant="contained"
        onClick={() => NavigateTo("/addreview", navigate, {
          restoName: restoName,
          restoID: restoID
        })}
        >
        {t("components.RestoCard.add-review")}
      </Button>
    </div>
  );
};

export default RatingDisplay;
