import * as express from 'express';
import {
  getFoodCategoriesBasedOnRestaurant,
  createFoodCategorie,
  deleteFoodCategorieByID,
  updateFoodCategorie
} from '../controllers/foodCategoriesController';
import { checkIfRestaurantExistsWithId } from '../middleware/restaurantMiddleWare';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
      return res.status(400)
        .send('No Restaurant with the provided Id was found');
    }
    const foodCategories = await getFoodCategoriesBasedOnRestaurant(req.body.restaurantId);

    return res.status(200)
      .send(foodCategories);
  } catch (error) {
    console.error("Error in 'foodCategorie' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/', async (req, res) => {
  try {
    if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
      return res.status(400)
        .send('No Restaurant with the provided Id was found');
    }

    if (req.body.foodCategorie.name === '') {
      return res.status(400)
        .send('No Food Categorie Name was given');
    }

    const foodCategorie = await updateFoodCategorie(req.body.foodCategorie, req.body.foodCategorieID);
    if (foodCategorie) {
      return res.status(200)
        .send(foodCategorie);
    }
  } catch (e) {
    console.error("Error in 'foodCategorie' route:", e);
    return res.status(404)
      .send('Put Food Categorie failed');
  }
});

router.post('/', async (req, res) => {
  try {
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
      .send('Food Categorie ' + req.body.name + ' saved ' +
        ' with restaurant id ' + req.body.restaurantId);
  } catch (error) {
    console.error("Error in 'foodCategorie' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    if (!await checkIfRestaurantExistsWithId(req.body.restaurantId)) {
      return res.status(400)
        .send('No Restaurant with the provided Id was found');
    }

    const deleteStatus = await deleteFoodCategorieByID(req.body.foodCategorieID);
    if (deleteStatus) {
      return res.status(200)
        .send('Food Categorie deleted with id ' + req.body.foodCategorieID);
    } else {
      return res.status(400)
        .send('Food Categorie not found');
    }
  } catch (error) {
    console.error("Error in 'foodCategorie' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
