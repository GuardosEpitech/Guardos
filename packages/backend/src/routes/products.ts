import * as express from 'express';

import {
  addRestoProduct, doesUserOwnRestaurantById,
  // getAllRestoProducts, getRestaurantByName
} from '../controllers/restaurantController';
import {
  changeProductById, createOrUpdateProduct, deleteProductById,
  // getAllProducts,
  getProductByName, getProductsByUser
} from '../controllers/productsController';
import {getUserIdResto} from '../controllers/userRestoController';
import { IRestaurantFrontEnd } from 'shared/models/restaurantInterfaces';

const router = express.Router();

// router.get('/', async (_req, res) => {
//   try {
//     const products = await getAllProducts();
//     if (!products)
//       return res.status(404);
//     return res.status(200)
//       .send(products);
//   } catch (error) {
//     console.error("Error in 'products' route:", error);
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });

router.get('/user/product', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const products = await getProductsByUser(userID as number);

    // Return 200 OK with the restaurant data
    return res.status(200)
      .send(products);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in 'products/user/product' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

// router.get('/:name', async (req, res) => {
//   try {
//     const products = await getAllRestoProducts(req.params.name);
//     return res.status(200)
//       .send(products);
//   } catch (error) {
//     console.error("Error in 'products/:name' route:", error);
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });

router.post('/:id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }
    const restaurant : IRestaurantFrontEnd = await doesUserOwnRestaurantById(
      req.params.id as unknown as number, userID as number);
    if (!restaurant) {
      return res.status(404)
        .send('Coudnt find restaurant named '
          + req.params.id + ' for this user');
    }

    const product = await createOrUpdateProduct(req.body, restaurant.uid);
    await addRestoProduct(req.body, restaurant.uid);
    return res.status(200)
      .send(product);
  } catch (error) {
    console.error("Error in 'products/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const productId = Number(req.params.id);
    if (await deleteProductById(productId) === true)
      return res.status(200)
        .send('Product deleted successfully');
    return res.status(404)
      .send('Product not found');
  } catch (error) {
    console.error("Error in 'products/:id' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    if (!await getProductByName(req.params.id)) {
      return res.status(404)
        .send('Coundt find product named ' + req.params.id);
    }
    const product = await changeProductById(req.body, Number(req.params.id));
    return res.status(200)
      .send(product);
  } catch (error) {
    console.error("Error in 'products/:name' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
