import * as express from 'express';

import {
  changeDishByName, createNewDish, deleteDishByName,
  getAllDishes, getDishByName, getDishByUser, getDishesByRestaurantName,
  addDishDiscount, removeDishDiscount
}
  from '../controllers/dishesController';
import {checkIfNameExists} from '../middleware/dishesMiddelWare';
import {
  checkIfRestaurantExists, checkIfRestaurantExistsWithId
} from '../middleware/restaurantMiddleWare';
import {getUserIdResto} from '../controllers/userRestoController';
import {detectAllergens} from '../controllers/allergenDetectionController';
import { getRestaurantByID } from '../controllers/restaurantController';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const dishes = await getAllDishes();
    return res.status(200)
      .send(dishes);
  } catch (error) {
    console.error("Error in '/dishes' route:", error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/user/dish', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const dishes = await getDishByUser(userID as number);
    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(dishes);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in 'dishes/user/dish' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/:name', async (req, res) => {
  try {
    if (!await checkIfRestaurantExists(req.params.name)) {
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    }
    const dishes = await getDishesByRestaurantName(req.params.name);
    return res.status(200)
      .send(dishes);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);

    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/:name', async (req, res) => {
  try {
    if (!await checkIfRestaurantExists(req.params.name)) {
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    }
    const dish = await deleteDishByName(req.params.name, req.body.name);
    return res.status(200)
      .send(dish);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }

});

router.put('/:name', async (req, res) => {
  try {
    if (!await checkIfRestaurantExists(req.params.name)) {
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    }
    if (!await getDishByName(req.params.name, req.body.name)) {
      return res.status(404)
        .send('Coundt find dish named ' + req.body.name);
    }
    const dish = await changeDishByName(req.params.name, req.body);
    return res.status(200)
      .send(dish);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }

});

router.post('/addDiscount', async (req, res) => {
  try {
    const { restoID, dish } = req.body;
    if (!await checkIfRestaurantExistsWithId(restoID)) {
      return res.status(404)
        .send('Coudnt find restaurant with id ' + restoID);
    }
    const resto = await getRestaurantByID(restoID);
    if (!await getDishByName(resto.name, dish.name)) {
      return res.status(404)
        .send('Coundt find dish named ' + dish.name);
    }
    const discountDish = await addDishDiscount(restoID, dish);
    return res.status(200)
      .send(discountDish);
  } catch (error) {
    console.error("Error in 'dishes/addDiscount' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/removeDiscount', async (req, res) => {
  try {
    const { restoID, dish } = req.body;
    if (!await checkIfRestaurantExistsWithId(restoID)) {
      return res.status(404)
        .send('Coudnt find restaurant with id ' + restoID);
    }
    const resto = await getRestaurantByID(restoID);
    if (!await getDishByName(resto.name, dish.name)) {
      return res.status(404)
        .send('Coundt find dish named ' + dish.name);
    }
    const discountDish = await removeDishDiscount(restoID, dish);
    return res.status(200)
      .send(discountDish);
  } catch (error) {
    console.error("Error in 'dishes/addDiscount' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/:name', async (req, res) => {
  try {
    const { userToken, resto, dish } = req.body;
    if (!await checkIfRestaurantExists(req.params.name)) {
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    }
    if (!checkIfNameExists(dish)) {
      return res.status(404)
        .send('Name is missing');
    }
    if (await getDishByName(resto, dish)) {
      return res.status(404)
        .send('There is already a dish with the name ' + req.body.name);
    }
    const userID = await getUserIdResto(userToken);
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const allergensDB = await detectAllergens(req);
    if (allergensDB.status !== 200) {
      return allergensDB;
    }
    const allergens: [string] = allergensDB.data[0].allergens;
    dish.allergens.push(...allergens);
    const newDish = await createNewDish(resto, dish, userID as number);
    return res.status(200)
      .send(newDish);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
