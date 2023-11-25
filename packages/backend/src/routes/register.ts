import * as express from 'express';
import { Response, Request } from 'express';
import { addUser } from '../controllers/userController';
import { addUserResto } from '../controllers/userRestoController';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const errArray = await addUser(data.username, data.email, data.password);

    return res.status(200).send(errArray);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/restoWeb', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const errArray = await addUserResto(data.username, data.email, data.password);

    return res.status(200).send(errArray);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

export default router;

