import React, { useEffect} from "react";
import { useLocation } from "react-router-dom";
import styles from "@src/pages/RatingPage/RatingPage.module.scss";
import Rating from '@mui/material/Rating';
import { getRatingData, postRatingData } from "@src/services/ratingCalls";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {useTranslation} from "react-i18next";
import { TextField } from "@mui/material";

const RatingPage = () => {
  const { restoName } = useLocation().state;
  const [note, setNote] = React.useState<number | null>(2);
  const [comment, setComment] = React.useState("");
  const [ratingData, setRatingData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const {t} = useTranslation();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setComment(event.target.value)
  };

  const averageRating = () => {
    let sum = 0;
    ratingData.forEach((data) => {
      sum += data.note;
    });
    return parseFloat((sum / ratingData.length).toFixed(1));
  }
  const addReview = async () => {
    try {
      const userToken = localStorage.getItem('user');
      const userName = localStorage.getItem("userName") || "";
      if (userToken === null) return;

      await postRatingData(restoName, comment, note, userName);
      setOpen(true);
      setNote(2);
      setComment('');
    } catch (err) {
      console.error(err);
    }

    getRatingData(restoName).then(res => setRatingData(res));
  };

  useEffect(() => {
    getRatingData(restoName).then(res => setRatingData(res));
  }, [restoName]);

  return (
    <>
      <div className={styles.RectOnImg}>
        <h2 className={styles.RestaurantTitle}>{restoName}</h2>
      </div>

      <div className={styles.Content}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {t('pages.RatingPage.comment-added-success')}
        </Alert>
      </Snackbar>
        <h2>{t('pages.RatingPage.add-review')}</h2>
        <div className={styles.RatingSection}>
          <div className={styles.NoteContainer}>
            <span className={styles.SpanTitleRating}>
              {t('pages.RatingPage.add-note')}
            </span>
            <Rating
              size="large"
              name="size-large"
              value={note}
              onChange={(event, newValue) => {
                setNote(newValue);
              }}/>
          </div>
          <div className={styles.CommentContainer}>
            <span className={styles.SpanTitleComment}>{t('pages.RatingPage.add-comment')}</span>
            <TextField
                style={{width: "640px"}}
                aria-label="minimum height"
                placeholder={t('pages.RatingPage.your-comment')}
                multiline
                minRows={10}
                variant="outlined"
                value={comment}
                onChange={handleComment}
            />
          </div>
          <Button variant="contained" onClick={addReview} className={styles.BtnSend}>
            {t('pages.RatingPage.add-my-review')}
          </Button>
        </div>
        <div className={styles.AllReviewContainer}>
          {ratingData === undefined ?
            <h2>{t('pages.RatingPage.no-reviews-yet')}</h2>
          :
            <div className={styles.RecapReview}>
              <h2>
                {t('pages.RatingPage.review-overview', {ratingAmount: ratingData.length})}
              </h2>
              <span className={styles.AverageTxt}>{averageRating()}</span>
              <Rating size="small" name="read-only" value={averageRating()} readOnly />
            </div>
          }
          {ratingData?.map((data, key) => (
            <div key={key} className={styles.CardReview}>
              <div className={styles.NoteContainer}>
                <span>{data.note}</span>
                <Rating name="read-only" value={data.note} readOnly />
              </div>
              <span>{data.comment}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RatingPage;
