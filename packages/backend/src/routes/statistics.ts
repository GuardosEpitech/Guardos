import express, { Router } from 'express';
import {getStatisticsForResto} from '../controllers/statisticsController';
import {getUserIdResto} from '../controllers/userRestoController';

const router: Router = express.Router();

router.get('/restaurant', async (req, res) => {
  try {
    const token = String(req.query.key);
    const userId = await getUserIdResto(token);
    if (userId === false) {
      return res.status(400)
        .send({ error: 'Invalid Access' });
    }
    const data = await getStatisticsForResto(userId as number);
    if (data === null) {
      return res.status(404)
        .json({ message: 'Statistics not found' });
    }
    return res.status(200)
      .send(data);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Server Error' });
  }
});

export default router;
