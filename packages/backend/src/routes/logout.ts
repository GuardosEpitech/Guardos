import * as express from 'express';
import { Response, Request } from 'express';
//import { logoutUserResto } from '../controllers/userRestoController';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;

    return data;
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

//router.post('/restoWeb', async function (req: Request, res: Response) {
//  try {
//    const data = req.body;
//    const answer = await logoutUserResto(data.token);
//
//    if (answer) {
//      return res.status(200).send(answer);
//    }
//    return res.status(404).send('Could not find the User to logout');
//  } catch (error) {
//    return res.status(500)
//      .send('An error occurred while processing your request');
//  }
//});

export default router;
