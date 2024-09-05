import React, { useRef, useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import styles from "@src/pages/RatingPage/RatingPage.module.scss";
import Rating from '@mui/material/Rating';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { getRatingData, postRatingData } from "@src/services/ratingCalls";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const RatingPage = () => {
  const { restoId, restoName } = useLocation().state;
  const [note, setNote] = React.useState<number | null>(2);
  let comment: string = null;
  const ref = useRef(null);
  const [ratingData, setRatingData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleComment = () => {
    comment = ref.current.value;
  };

  const averageRating = () => {
    let sum = 0;
    ratingData.forEach((data) => {
      sum += data.note;
    });
    return parseFloat((sum / ratingData.length).toFixed(1));
  }

  const addReview = () => {
    try {
      const userToken = localStorage.getItem('user');
      if (userToken === null) { return; }
      postRatingData(restoId, comment, note, userToken);
      setOpen(true);
    }
    catch (err) {
      console.error(err);
    }
    setNote(2);
    comment = null;
    getRatingData(restoId).then(res => setRatingData(res));
  };

  useState(() => {
    getRatingData(restoId).then(res => setRatingData(res));
  })

  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 640px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

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
            <Textarea
              aria-label="minimum height"
              minRows={10}
              placeholder={t('pages.RatingPage.your-comment')}
              ref={ref}
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
