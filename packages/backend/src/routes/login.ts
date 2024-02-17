import * as express from 'express';
import { Response, Request } from 'express';
import {getUserId, loginUser} from '../controllers/userController';
import { loginUserResto, getUserIdResto }
  from '../controllers/userRestoController';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await loginUser(data.username, data.password);

    if (answer !== false) {
      return res.send(data);
    } else {
      return res.status(403)
        .send('Invalid Access');
    }
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/checkIn', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);;
    const answer = await getUserId(userToken);

    if (answer !== false) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.send('An error occurred while processing your request');
  }
});

router.post('/restoWeb', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await loginUserResto(data.username, data.password);

    if (answer !== false) {
      return res.status(200).send(answer);
    } else {
      return res.send('Invalid Access');
    }
  } catch (error) {
    return res.send('An error occurred while processing your request');
  }
});

router.get('/restoWeb/checkIn', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);;
    const answer = await getUserIdResto(userToken);

    if (answer !== false) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.send('An error occurred while processing your request');
  }
});

export default router;
