import React, { useEffect} from "react";
import { useLocation } from "react-router-dom";
import styles from "./ViewRatingPage.module.scss";
import Rating from '@mui/material/Rating';
import { getRatingData } from "@src/services/ratingCalls";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "@src/utils/DarkMode";

const ViewRatingPage = () => {
  const { restoName, restoID } = useLocation().state;
  const [ratingData, setRatingData] = React.useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);



  const averageRating = () => {
    let sum = 0;
    ratingData.forEach((data) => {
      sum += data.note;
    });
    return parseFloat((sum / ratingData.length).toFixed(1));
  }

  useEffect(() => {
    getRatingData(restoID).then(res => setRatingData(res));
  }, [restoID]);

  return (
    <>
      <div className={styles.RectOnImg}>
        <h2 className={styles.RestaurantTitle}>{restoName}</h2>
      </div>
      <div className={styles.Content}>
        <div className={styles.AllReviewContainer}>
          {ratingData.length === 0 ?
            <h2>{t('pages.RatingPage.no-reviews-yet')}</h2>
          :
          <>
            <div className={styles.RecapReview}>
              <h2>
                {t('pages.RatingPage.review-overview', {ratingAmount: ratingData.length})}
              </h2>
              <span className={styles.AverageTxt}>{averageRating()}</span>
              <Rating size="small" name="read-only" value={averageRating()} readOnly />
            </div>
            {ratingData?.map((data, key) => (
              <div key={key} className={styles.CardReview}>
                <div className={styles.NoteContainer}>
                  <span>{data.note}</span>
                  <Rating name="read-only" value={data.note} readOnly />
                </div>
                <span>{data.comment}</span>
              </div>
            ))}
          </>
          }
        </div>
      </div>
    </>
  );
};

export default ViewRatingPage;
