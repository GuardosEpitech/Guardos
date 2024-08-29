import express from 'express';
import {getMenuByRestoID} from '../controllers/menuController';
import {updateRestoUserStatistics} from '../controllers/statisticsController';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const restoID = Number(req.body.restoID);
    const allergenList = req.body.allergenList;
    const dislikedIngrList = req.body.dislikedIngredientsList;

    //@ts-ignore
    const menu = await getMenuByRestoID(restoID, allergenList, dislikedIngrList);
    await updateRestoUserStatistics(restoID, allergenList, dislikedIngrList);
    return res.status(200)
      .send(menu);
  } catch (error) {
    console.error("Error in GET '/api/menu' route:", error);

    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
