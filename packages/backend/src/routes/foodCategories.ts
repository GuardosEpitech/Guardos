import * as express from 'express';
import {
  getFoodCategoriesBasedOnRestaurant,
  createFoodCategorie,
  deleteFoodCategorieByID
} from '../controllers/foodCategoriesController';
import { checkIfRestaurantExistsWithId } from '../middleware/restaurantMiddleWare';

const router = express.Router();

router.get('/', async (req, res) => {
  if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
    return res.status(400)
      .send('No Restaurant with the provided Id was found');
  }
  const foodCategories = await getFoodCategoriesBasedOnRestaurant(req.body.restaurantId);
  
  return res.status(200)
    .send(foodCategories);
});

router.post('/', async (req, res) => {
  if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
    return res.status(400)
      .send('No Restaurant with the provided Id was found');
  }
  if (req.body.name === '') {
    return res.status(400)
      .send('No Food Categorie Name was given');
  }
  await createFoodCategorie(req.body.restaurantId, req.body.name);

  return res.status(200)
    .send('Food Categorie '
      + req.body.name + ' saved ' + ' with restaurant id ' + req.body.restaurantId);
})

router.delete('/', async (req, res) => {

  if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
    return res.status(400)
      .send('No Restaurant with the provided Id was found');
  }

  const deleteStatus = await deleteFoodCategorieByID(req.body.foodCategorieID)
  if (deleteStatus) {
    return res.status(200)
      .send('Food Categorie deleted with id ' + req.body.foodCategorieID);
  } else {
    return res.status(400)
      .send('Food Categorie not found');
  }
});

export default router;
