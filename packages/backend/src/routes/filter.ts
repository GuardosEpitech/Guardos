import bodyParser from 'body-parser';
import * as express from 'express';
import { Response, Request } from 'express';

import { handleFilterRequest, getSelectedFilterReq }
  from '../middleware/filterMiddleWare';

const router = express.Router();

router.use(bodyParser.json());

router.post('/', async function (req: Request, res: Response) {
  try {
    const answer = await handleFilterRequest(req.body);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/filteredlist', async function (req: Request, res: Response) {
  try {
    const answer = await getSelectedFilterReq(req.body);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

export default router;
