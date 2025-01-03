import * as express from 'express';

import {
  createNewDish, deleteDishByName,
  getAllDishes, getDishByName, getDishByUser, getDishesByRestaurantName,
  addDishDiscount, removeDishDiscount, addDishCombo, removeDishCombo,
  createNewForEveryRestoChainDish, getDishByID, changeDishByID,
  getAllergensFromDishProducts
}
  from '../controllers/dishesController';
import {checkIfNameExists} from '../middleware/dishesMiddelWare';
import {
  checkIfRestaurantExists
} from '../middleware/restaurantMiddleWare';
import {getUserIdResto} from '../controllers/userRestoController';
import {
  doesUserOwnRestaurantByName,
  getRestaurantByID
} from '../controllers/restaurantController';
import { IDishesCommunication } from '../models/communicationInterfaces';

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

router.post('/dishIDs', async (req, res) => {
  try {
    const restoName = String(req.query.key);
    if (!await checkIfRestaurantExists(restoName)) {
      return res.status(404)
        .send('Coudnt find restaurant named ' + restoName);
    }
    const { ids } = req.body;
    const dishes = await getDishesByRestaurantName(restoName);
    const dishesArray = dishes[0].dishes;
    const filteredDishes = dishesArray.filter(dish => ids.includes(dish.uid));
    return res.status(200)
      .send(filteredDishes);
  } catch (error) {
    console.error("Error in 'dishes/dishIDs' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/dishIDsByID', async (req, res) => {
  try {
    const restoID = Number(req.query.key);
    if (!await getRestaurantByID(restoID)) {
      return res.status(404)
        .send('Coudnt find restaurant with ID  ' + restoID);
    }
    const resto = await getRestaurantByID(restoID);
    const { ids } = req.body;
    const dishes = await getDishesByRestaurantName(resto.name);
    const dishesArray = dishes[0].dishes;
    const filteredDishes = dishesArray.filter(dish => ids.includes(dish.uid));
    return res.status(200)
      .send(filteredDishes);
  } catch (error) {
    console.error("Error in 'dishes/dishIDs' route:", error);
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
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }
    if (!(await doesUserOwnRestaurantByName(req.params.name,
      userID as number))) {
      return res.status(404)
        .send('Couldnt find restaurant named '
          + req.params.name + ' for this user');
    }

    const response = await deleteDishByName(req.params.name, req.body.name);
    return res.status(200)
      .send(response);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }

});

router.put('/:name', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const restaurant = await doesUserOwnRestaurantByName(req.params.name,
      userID as number);
    if (!restaurant || restaurant.userID !== userID) {
      return res.status(404)
        .send('Couldnt find restaurant named '
        + req.params.name + ' for this user');
    }
    if (!req.body.uid) {
      return res.status(404)
        .send('Coundt find dish named ' + req.body.name);
    }
    const dishToChange = await getDishByID(restaurant.uid,req.body.uid);
    if (!dishToChange) {
      return res.status(404)
        .send('Coundt find dish named ' + req.body.name);
    }
    const newDish: IDishesCommunication = req.body;
    const allergens =
      await getAllergensFromDishProducts(newDish, userID as number);

    const dish = await changeDishByID(
      restaurant.uid, req.body, allergens);
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
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const { restoName, dish } = req.body;
    const restaurant = await doesUserOwnRestaurantByName(restoName,
      userID as number);
    if (!restaurant || restaurant.userID !== userID) {
      return res.status(404)
        .send('Couldnt find restaurant named '
        + restoName + ' for this user');
    }

    if (!await getDishByName(restoName, dish.name)) {
      return res.status(404)
        .send('Coundt find dish named ' + dish.name);
    }
    const discountDish = await addDishDiscount(restaurant.uid, dish);
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
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const { restoName, dish } = req.body;

    const restaurant = await doesUserOwnRestaurantByName(restoName,
      userID as number);
    if (!restaurant || restaurant.userID !== userID) {
      return res.status(404)
        .send('Couldnt find restaurant named '
        + restoName + ' for this user');
    }
    const discountDish = await removeDishDiscount(restaurant.uid, dish);
    return res.status(200)
      .send(discountDish);
  } catch (error) {
    console.error("Error in 'dishes/addDiscount' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/addCombo', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const {restoName, dish, combo} = req.body;
    const restaurant = await doesUserOwnRestaurantByName(restoName,
      userID as number);
    if (!restaurant || restaurant.userID !== userID) {
      return res.status(404)
        .send('Couldnt find restaurant named '
        + restoName + ' for this user');
    }
    const newDish = await addDishCombo(restaurant, dish, combo);
    return res.status(200)
      .send(newDish);
  } catch (error) {
    console.error("Error in 'dishes/addCombo' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/removeCombo', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const {restoName, dish} = req.body;
    const restaurant = await doesUserOwnRestaurantByName(restoName,
      userID as number);
    if (!restaurant || restaurant.userID !== userID) {
      return res.status(404)
        .send('Couldnt find restaurant named '
        + restoName + ' for this user');
    }

    const newDish = await removeDishCombo(restaurant, dish);
    return res.status(200)
      .send(newDish);
  } catch (error) {
    console.error("Error in 'dishes/addCombo' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/:name', async (req, res) => {
  try {
    const { resto, dish, restoChainID } = req.body;
    const userToken = String(req.query.key);
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

    dish.allergens = await getAllergensFromDishProducts(dish, userID as number);

    const newDish = await createNewDish(resto, dish, userID as number);
    if (restoChainID) {
      await createNewForEveryRestoChainDish(dish,
          userID as number, restoChainID, resto);
    }
    return res.status(200)
      .send(newDish);
  } catch (error) {
    console.error("Error in 'dishes/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
