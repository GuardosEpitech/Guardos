import * as express from 'express';

import {
  changeRestaurant, createNewRestaurant, deleteRestaurantByName,
  getAllRestaurants, getRestaurantByName
}
  from '../controllers/restaurantController';
import { findMaxIndexRestaurants } from '../middleware/restaurantMiddleWare';

const router = express.Router();

router.get('/', async (_req, res) => {
  const restaurant = await getAllRestaurants();
  return res.status(200)
    .send(restaurant);
});

router.get('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  return res.status(200)
    .send(restaurant);
});

router.post('/', async (req, res) => {
  const maxID = await findMaxIndexRestaurants();
  const restaurant = await createNewRestaurant(req.body, maxID + 1);
  return res.status(200)
    .send(restaurant);
});

router.delete('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  const answerRestaurant = deleteRestaurantByName(req.params.name);
  return res.status(200)
    .send(answerRestaurant);
});

router.put('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  const answer = await changeRestaurant(req.body, req.params.name);
  return res.status(200)
    .send(answer);
});
export default router;
