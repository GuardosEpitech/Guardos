import express, { Router } from 'express';
import {
  getAllRestoReviews,
  addRestoReview,
  deleteRestoReview,
  modifyRestoReview,
} from '../controllers/restaurantController';

const router: Router = express.Router();

// Route to get all reviews for a restaurant
router.get('/restaurants/:restoName', async (req, res) => {
  try {
    const { restoName } = req.params;
    const reviews = await getAllRestoReviews(restoName);
    if (reviews.length === 0) {
      return res.status(404)
        .json({ message: 'Reviews not found' });
    }
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

// Route to add a review to a restaurant
router.post('/restaurants/:restoName', async (req, res) => {
  try {
    const { restoName } = req.params;
    const review = req.body;
    const newReview = await addRestoReview(review, restoName);
    console.log('revaiuzhiaduaiduahdiazdhiazduhzadiuhiew');
    console.log(newReview);
    return res.status(200)
      .send(newReview);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

// Route to delete a review from a restaurant
router.delete('/restaurants/:restoName/:reviewId', async (
  req, res) => {
  try {
    const { restoName, reviewId } = req.params;
    const result = await deleteRestoReview(reviewId, restoName);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

// Route to modify a review of a restaurant
router.put('/restaurants/:restoName/:reviewId', async (
  req, res) => {
  try {
    const { restoName, reviewId } = req.params;
    const modifiedReview = req.body;
    const result = await modifyRestoReview(reviewId, modifiedReview, restoName);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

export default router;
