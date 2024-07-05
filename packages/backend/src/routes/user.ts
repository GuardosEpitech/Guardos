import * as express from 'express';
import { Response, Request } from 'express';

import {
  getAllergens,
  updateAllergens,
  doesUserExist, getUserId, updateDislikedIngredients, getDislikedIngredients
} from '../controllers/userController';
import { doesUserRestoExist } from '../controllers/userRestoController';

const router = express.Router();

router.post('/allergens/update', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await updateAllergens(data.username, data.allergens);
    return res.send(answer);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/allergens/get', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }

    const answer = await getAllergens(userID);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/dislikedIngredients', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }

    const ingredientsList = req.body.dislikedIngredients;
    const answer =
      await updateDislikedIngredients(userID as number, ingredientsList);
    return res.send(answer);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/dislikedIngredients/get', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }

    const answer = await getDislikedIngredients(userID);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/userRestoExist', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await doesUserRestoExist(data.username, data.email);
    return res.send(answer);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/userVisitorExist', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await doesUserExist(data.username, data.email);
    return res.send(answer);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

export default router;
