import * as express from 'express';

import { getAllRestoProducts } from '../controllers/restaurantController';

const router = express.Router();

router.get('/:name', async (req, res) => {
  const products = await getAllRestoProducts(req.params.name);
  return res.status(200)
    .send(products);
});

export default router;
