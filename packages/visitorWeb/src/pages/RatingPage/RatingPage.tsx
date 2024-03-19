import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "@src/pages/RatingPage/RatingPage.module.scss";
import Rating from '@mui/material/Rating';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { getRatingData, postRatingData } from "@src/services/ratingCalls";
import Button from "@mui/material/Button";

const RatingPage = () => {
  const { restoName } = useLocation().state;
  const [note, setNote] = React.useState<number | null>(2);
  let comment: string = null;
  const ref = useRef(null);
  const [ratingData, setRatingData] = React.useState([]);


  const handleComment = () => {
    comment = ref.current.value;
  };

  const addReview = () => {
    postRatingData(restoName, comment, note);
  };

  useState(() => {
    getRatingData(restoName).then(res => setRatingData(res));
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
        <h2>Add a review</h2>
        <div className={styles.RatingSection}>
          <div className={styles.NoteContainer}>
            <span className={styles.SpanTitleRating}>Add a note :</span>
            <Rating
              size="large"
              name="size-large"
              value={note}
              onChange={(event, newValue) => {
                setNote(newValue);
              }}/>
          </div>
          <div className={styles.CommentContainer}>
            <span className={styles.SpanTitleComment}>Add a comment :</span>
            <Textarea
              aria-label="minimum height"
              minRows={10}
              placeholder="Your comment..."
              ref={ref}
              value={comment}
              onChange={handleComment}
            />
          </div>
          <Button variant="contained" onClick={addReview} className={styles.BtnSend}>
            Add my review
          </Button>
        </div>
        {/* {ratingData.map((data, key) => (
          <div key={key} className={styles.CardReview}>
            <span>{data.note}</span>
            <span>{data.comment}</span>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default RatingPage;
