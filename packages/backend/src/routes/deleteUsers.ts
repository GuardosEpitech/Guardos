import * as express from 'express';
import { Response, Request } from 'express';
import {deleteUser, getUserId} from '../controllers/userController';
import {getAllUserRestaurants, deleteRestaurantByName} from '../controllers/restaurantController';
import {deleteUserResto, getUserIdResto}
  from '../controllers/userRestoController';

const router = express.Router();

router.delete('/', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }
    const answer = await deleteUser(userID);
    if (answer) {
      return res.status(200)
        .send(answer);
    }
    return res.status(404)
      .send('Could not find the User to delete');
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.delete('/resto', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }

    const restos = await getAllUserRestaurants(userID as number);

    for (const resto of await restos) {
      await deleteRestaurantByName(resto.name);
    }

    const answer = await deleteUserResto(userID as number);

    if (answer) {
      return res.status(200)
        .send(answer);
    }
    return res.status(404)
      .send('Could not find the User to delete');
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

export default router;

