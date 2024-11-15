import express from 'express';
import { getUserId } from '../controllers/userController';
import { getAllRestaurants } from '../controllers/restaurantController';
import {categorizeAndSort} from '../controllers/categorieController';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (!userID) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const restos = await getAllRestaurants();
    const categories: string[] = restos
      .flatMap(resto =>
        resto.categories?.filter((cate: any) => 
          cate.dishes && cate.dishes.length > 0)
          .map((cate: any) => cate.name) || []
      )
      .filter((name: string) => name?.length);

    const sortedCategories = categorizeAndSort(categories);

    return res.status(200)
      .send(sortedCategories);
  } catch (error) {
    console.error("Error in 'categories' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
