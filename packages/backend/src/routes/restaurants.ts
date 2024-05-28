import * as express from 'express';

import {
  changeRestaurant, createNewRestaurant, deleteRestaurantByName,
  getAllRestaurants, getRestaurantByName, getAllUserRestaurants, 
  addCategory
}
  from '../controllers/restaurantController';
import { findMaxIndexRestaurants } from '../middleware/restaurantMiddleWare';
import { addProductsFromRestaurantToOwnDB }
  from '../controllers/productsController';
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

router.post('/', async (req, res) => {
  try {
    const maxID = await findMaxIndexRestaurants();
    const { userToken, resto } = req.body;
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
    await addProductsFromRestaurantToOwnDB(restaurant.id);
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

router.delete('/:name', async (req, res) => {
  try {
    const restaurant = await getRestaurantByName(req.params.name);
    if (!restaurant)
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    const answerRestaurant = deleteRestaurantByName(req.params.name);
    return res.status(200)
      .send(answerRestaurant);
  } catch (error) {
    console.error("Error in 'restaurants/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }

});

router.put('/:name', async (req, res) => {
  try {
    const restaurant = await getRestaurantByName(req.params.name);
    if (!restaurant)
      return res.status(404)
        .send('Coudnt find restaurant named ' + req.params.name);
    const answer = await changeRestaurant(req.body, req.params.name);
    await addProductsFromRestaurantToOwnDB(answer.uid);
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
    const answer = await addCategory(uid, newCategories);
    return res.status(200)
      .send(answer);
  } catch (error) {
    console.error("Error in 'restaurants/updateCategories' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
