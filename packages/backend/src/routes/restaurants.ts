import * as express from 'express';

import {
  createNewRestaurant,
  getAllRestaurants, getRestaurantByName, getAllUserRestaurants,
  addCategory, getAllUserRestaurantChains,
  getAllRestosFromRestoChain, doesUserOwnRestaurantById,
  deleteRestaurantByID, getRestaurantByID, changeRestaurantByID
}
  from '../controllers/restaurantController';
import { findMaxIndexRestaurants } from '../middleware/restaurantMiddleWare';
import { getUserIdResto }
  from '../controllers/userRestoController';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const restaurant = await getAllRestaurants();
    return res.status(200)
      .send(restaurant);
  } catch (error) {
    console.error("Error in 'restaurants' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const restaurant = await getRestaurantByName(req.params.name);
    if (!restaurant)
      return res.status(404)
        .send('Coudnt find restaurant/:name named ' + req.params.name);
    return res.status(200)
      .send(restaurant);
  } catch (error) {
    console.error("Error in 'restaurants' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      return res.status(404)
        .send({ error: 'Restaurant ID not given' });
    }
    const restaurant = await getRestaurantByID(Number(req.params.id));
    if (!restaurant)
      return res.status(404)
        .send('Coudnt find restaurant/:id  ' + req.params.id);
    return res.status(200)
      .send(restaurant);
  } catch (error) {
    console.error("Error in 'restaurants' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const maxID = await findMaxIndexRestaurants();
    const { userToken, resto } = req.body;
    console.log(resto);
    const userID = await getUserIdResto(userToken);
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    if (resto.name === '') {
      return res.status(404)
        .send({ error: 'empty Resto name' });
    }
    const restaurant = await createNewRestaurant(
      resto, userID as number, maxID + 1);
    return res.status(200)
      .send(restaurant);
  } catch (error) {
    console.error("Error in 'restaurants' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/user/resto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    
    const restaurant = await getAllUserRestaurants(userID as number);
    
    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(restaurant);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in 'restaurants/user/resto' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/user/resto/chain', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    
    const restaurantChains = await getAllUserRestaurantChains(userID as number);
    
    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(restaurantChains);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in 'restaurants/user/resto/chain' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/user/resto/chain/resto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const restoChainID = Number(req.query.restoChainID);
    const userID = await getUserIdResto(userToken);
    
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    if (restoChainID === undefined || restoChainID === null) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'Restaurant Chain ID not given' });
    }
    
    const restaurants = await getAllRestosFromRestoChain(
        userID as number,
        restoChainID as number);
    
    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(restaurants);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in 'restaurants/user/resto/chain' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const restId = Number(req.params.id);
    if (restId === undefined || restId === null) {
      return res.status(404)
        .send({ error: 'Restaurant ID not given' });
    }
    if (!(await doesUserOwnRestaurantById(restId,
        userID as number))) {
      return res.status(404)
        .send('Coudnt find restaurant named '
              + restId+ ' for this user');
    }

    const answerRestaurant = deleteRestaurantByID(restId);
    return res.status(200)
      .send(answerRestaurant);
  } catch (error) {
    console.error("Error in 'restaurants/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const restId = Number(req.params.id);
    if (restId === undefined || restId === null) {
      return res.status(404)
        .send({ error: 'Restaurant ID not given' });
    }
    if (!(await doesUserOwnRestaurantById(restId,
        userID as number))) {
      return res.status(404)
        .send('Coudnt find restaurant named '
              + restId + ' for this user');
    }
    const restaurant = await getRestaurantByID(restId);
    if (!restaurant)
      return res.status(404)
        .send('Coudnt find restaurant with id ' + restId);
    const answer = await changeRestaurantByID(req.body, restId);
    return res.status(200)
      .send(answer);
  } catch (error) {
    console.error("Error in 'restaurants/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/updateCategories', async (req, res) => {
  try {
    const { userToken, uid, newCategories } = req.body;
    const userID = await getUserIdResto(userToken);
    
    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const answer = await addCategory(userID as number, uid, newCategories);
    return res.status(200)
      .send(answer);
  } catch (error) {
    console.error("Error in 'restaurants/updateCategories' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
