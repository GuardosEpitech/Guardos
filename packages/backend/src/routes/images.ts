import * as express from 'express';
import {
  linkImageToRestaurant,
  getLatestID,
  saveImageToDB, linkImageToRestaurantDish, linkImageToRestaurantExtra
} from '../controllers/imageController';
import {errorHandlingImage} from '../middleware/imagesMiddleWare';
const router = express.Router();

router.get('/', async (_req, res) => {
  return res.status(200)
    .send('Get Images');
});

router.post('/', async (_req, res) => {
  try {
    // TODO: require also restaurant to be able to save images --> store image id as ref to restaurant
    //const restaurantName: string = _req.body.restaurantName;
    const dishName: string = _req.body.dish;
    const extraName: string = _req.body.extra;
    const error: string = await errorHandlingImage(_req);
    if (error) {
      return res.status(404)
        .send(error);
    }

    if (dishName) {
      await saveImageToDB(
        _req.body.image.filename,
        _req.body.image.contentType,
        _req.body.image.size,
        _req.body.image.base64);

      const id: number = await getLatestID();
      await linkImageToRestaurantDish(_req.body.restaurant, dishName, id);
      console.log('return after dish');
      return res.status(200)
        .send('Post Image for dish successfully');
    }

    if (extraName) {
      await saveImageToDB(
        _req.body.image.filename,
        _req.body.image.contentType,
        _req.body.image.size,
        _req.body.image.base64);

      const id: number = await getLatestID();
      await linkImageToRestaurantExtra(_req.body.restaurant, extraName, id);
      // save image to restaurant extra
      return res.status(200)
        .send('Post Images for extra successfully');
    }

    await saveImageToDB(
      _req.body.image.filename,
      _req.body.image.contentType,
      _req.body.image.size,
      _req.body.image.base64);
    const id: number = await getLatestID();
    await linkImageToRestaurant(_req.body.restaurant, id);
    console.log('return after restaurant');
    return res.status(200)
      .send('Post Images for restaurant successfully');

  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Post Images failed');
  }
});

router.delete('/:name', async (_req, res) => {
  return res.status(200)
    .send('Delete Images');
});

router.put('/:name', async (_req, res) => {
  return res.status(200)
    .send('Put Images');
});

export default router;