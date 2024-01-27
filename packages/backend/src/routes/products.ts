import * as express from 'express';

import {
  addRestoProduct,
  getAllRestoProducts, getRestaurantByName
} from '../controllers/restaurantController';
import {
  changeProductByName, createOrUpdateProduct, deleteProductByName,
  getAllProducts, getProductByName, getProductsByUser
} from '../controllers/productsController';
import {getUserIdResto} from '../controllers/userRestoController';

const router = express.Router();

router.get('/', async (_req, res) => {
  const products = await getAllProducts();
  if (!products)
    return res.status(404);
  return res.status(200)
    .send(products);
});

router.get('/user/product', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const products = await getProductsByUser(userID);

    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(products);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in '/user/product' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
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

router.put('/:name', async (req, res) => {
  if (!await getProductByName(req.params.name)) {
    return res.status(404)
      .send('Coundt find product named ' + req.params.name);
  }
  const product = await changeProductByName(req.body, req.params.name);
  return res.status(200)
    .send(product);
});

export default router;
