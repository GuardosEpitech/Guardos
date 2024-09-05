import express, { Router } from 'express';
import {
  getAllRestoReviews,
  addRestoReview,
  // deleteRestoReview,
  // modifyRestoReview,
} from '../controllers/restaurantController';
import {getUserId} from '../controllers/userController';

const router: Router = express.Router();

// Route to get all reviews for a restaurant
router.get('/restaurants/:restoId', async (req, res) => {
  try {
    const { restoId } = req.params;
    const reviews = await getAllRestoReviews(Number(restoId));
    if (reviews.length === 0) {
      return res.status(404)
        .json({ message: 'Reviews not found' });
    }
    return res.status(200)
      .send(reviews);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

// Route to add a review to a restaurant
router.post('/restaurants/:restoId', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const { restoId } = req.params;
    const review = req.body;
    const newReview = await addRestoReview(review, Number(restoId));
    return res.status(200)
      .send(newReview);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

// // Route to delete a review from a restaurant
// router.delete('/restaurants/:restoName/:reviewId', async (
//   req, res) => {
//   try {
//     const { restoName, reviewId } = req.params;
//     const result = await deleteRestoReview(reviewId, restoName);
//     return res.status(200)
//       .send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500)
//       .json({ message: 'Server Error' });
//   }
// });
//
// // Route to modify a review of a restaurant
// router.put('/restaurants/:restoName/:reviewId', async (
//   req, res) => {
//   try {
//     const { restoName, reviewId } = req.params;
//     const modifiedReview = req.body;
//     const result = await modifyRestoReview(reviewId, modifiedReview, restoName);
//     return res.status(200)
//       .send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500)
//       .json({ message: 'Server Error' });
//   }
// });

export default router;
