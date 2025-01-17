import * as express from 'express';
import {getUserId} from '../controllers/userController';
import {checkIfRestaurantExistsWithId}
  from '../middleware/restaurantMiddleWare';
import {checkIfDishExistsByID} from '../middleware/dishesMiddelWare';
import {
  addDishAsFavourite,
  addRestoAsFavourite,
  deleteDishFromFavourites,
  deleteRestoFromFavourites, getDishFavourites, getRestoFavourites
} from '../controllers/favouritesController';

const router = express.Router();

router.post('/resto', async (req, res) => {
  try {
    const restoID = req.body.restoID;
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    if (!await checkIfRestaurantExistsWithId(restoID)) {
      return res.status(404)
        .send('Couldn\'t find restaurant with id ' + restoID);
    }

    const userData = await addRestoAsFavourite(userID, restoID);
    return res.status(200)
      .send(userData ? userData.favouriteLists : []);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/dish', async (req, res) => {
  try {
    const restoID = req.body.restoID;
    const dishID = req.body.dishID;
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    if (!await checkIfDishExistsByID(restoID, dishID)) {
      return res.status(404)
        .send('Couldn\'t find dish with id ' + dishID + ' from resto ' + restoID);
    }

    const userData = await addDishAsFavourite(userID, restoID, dishID);
    return res.status(200)
      .send(userData ? userData.favouriteLists : []);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.delete('/resto', async (req, res) => {
  try {
    const restoID = Number(req.body.restoID);
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const userData = await deleteRestoFromFavourites(userID, restoID);
    return res.status(200)
      .send(userData ? userData.favouriteLists : []);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.delete('/dish', async (req, res) => {
  try {
    const restoID = Number(req.body.restoID);
    const dishID = Number(req.body.dishID);
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const userData = await deleteDishFromFavourites(userID, restoID, dishID);
    return res.status(200)
      .send(userData ? userData.favouriteLists : []);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/resto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const favouriteRestaurants = await getRestoFavourites(userID);
    return res.status(200)
      .send(favouriteRestaurants);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/dish', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const favouriteDishes = await getDishFavourites(userID);
    return res.status(200)
      .send(favouriteDishes);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

export default router;
