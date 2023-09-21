import * as express from 'express';

import {
  addRestoProduct,
  getAllRestoProducts, getRestaurantByName
} from '../controllers/restaurantController';
import { createOrUpdateProduct, deleteProductByName,
  getAllProducts } from '../controllers/productsController';

const router = express.Router();

router.get('/', async (_req, res) => {
  const products = await getAllProducts();
  if (!products)
    return res.status(404);
  return res.status(200)
    .send(products);
});

router.get('/:name', async (req, res) => {
  const products = await getAllRestoProducts(req.params.name);
  return res.status(200)
    .send(products);
});

router.post('/:name', async (req, res) => {
  const restaurant = req.params.name;
  const restaurantId = await getRestaurantByName(restaurant);
  const product = await createOrUpdateProduct(req.body, restaurantId.id);
  await addRestoProduct(req.body, restaurant);
  return res.status(200)
    .send(product);
});

router.delete('/:name', async (req, res) => {
  const productName = req.params.name;
  if (await deleteProductByName(productName) === true)
    return res.status(200)
      .send('Product deleted successfully');
  return res.status(404)
    .send('Product not found');
});

export default router;