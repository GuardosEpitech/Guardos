import express from 'express';
import {getAllUserRestaurantsFiltered} from '../controllers/restaurantController';
import {getUserIdResto} from '../controllers/userRestoController';

const router = express.Router();

router.post('/', async (_req, res) => {
  try {
    const userToken = String(_req.query.key);
    const userID = await getUserIdResto(userToken);
    const filter = _req.body.filter;
    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    if (filter === undefined) {
      return res.status(404)
        .send({ error: 'Filter not found' });
    }
    const restaurant =
        await getAllUserRestaurantsFiltered(userID as number, filter);

    return res.status(200)
      .send(restaurant);
  } catch (error) {
    console.error("Error in 'restaurants' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
