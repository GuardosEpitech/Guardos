import * as express from 'express';
import { Response, Request } from 'express';

import { getAllergens, updateAllergens } from '../controllers/userController';
import { 
  getUserInfoResto, 
  updateUserResto 
} from '../controllers/userRestoController';

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
    const data = req.body;
    const answer = await getAllergens(data.username);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/data', async function (req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  try {
    const userInfo = await getUserInfoResto(token);
    if (!userInfo) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update', async function (req: Request, res: Response) {
  const { token, newUsername, newEmail, newLocation } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  try {
    const answer = await updateUserResto(token, newUsername, newEmail, newLocation);
    console.log(answer);
    return res.status(200).send(answer);
  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
