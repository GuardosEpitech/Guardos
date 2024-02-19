import * as express from 'express';
import { Response, Request } from 'express';
import {deleteUser} from '../controllers/userController';
import {deleteUserResto} from '../controllers/userRestoController';

const router = express.Router();

router.delete('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    if (data.uID === undefined) {
      return res.status(400)
        .send('Invalid Access');
    }
    const answer = await deleteUser(data.uID);
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
    const data = req.body;
    if (data.uID === undefined) {
      return res.status(400)
        .send('Invalid Access');
    }
    const answer = await deleteUserResto(data.uID);
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

