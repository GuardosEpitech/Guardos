import * as express from 'express';
import {
  linkImageToRestaurant,
  getLatestID,
  saveImageToDB,
  linkImageToRestaurantDish,
  linkImageToRestaurantExtra,
  unlinkImageFromRestaurantExtra,
  deleteImageFromDB,
  unlinkImageFromRestaurantDish,
  unlinkImageFromRestaurant,
  getImageById, changeImageById
} from '../controllers/imageController';
import {
  errorHandlingImage,
  errorHandlingImageChange,
  errorHandlingImageDelete
} from '../middleware/imagesMiddleWare';
import {addRestoProfilePic, getUserIdResto} from '../controllers/userRestoController';
import {getUserId} from '../controllers/userController';

const router = express.Router();
// get image by id or by id array
router.get('/', async (_req, res) => {
  try {
    const imageId = _req.query.imageId ? _req.query.imageId : null;
    const imageIds = _req.query.imageIds ?
      _req.query.imageIds : null;

    if (!imageIds && !imageId) {
      return res.status(404)
        .send('Get Images failed: imageIds or imageId missing');
    }
    // if imageId
    if (imageId) {
      if (isNaN(Number(imageId))) {
        return res.status(404)
          .send('Get Images failed: imageId missing or not a number');
      }
      const image = await getImageById(Number(imageId));
      if (image) {
        return res.status(200)
          .send(image);
      } else {
        return res.status(404)
          .send('Get Images failed: Image does not exist');
      }
    }

    const imageIdsArray = imageIds.toString()
      .split(',');

    // if imageIds
    const images = [];
    for (const id of imageIdsArray) {
      if (isNaN(Number(id))) {
        return res.status(404)
          .send('Get Images failed: imageId missing or not a number');
      }
      const image = await getImageById(Number(id));
      if (image) {
        images.push(image);
      }
    }
    return res.status(200)
      .send(images);

  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Get Images failed');
  }
});

router.post('/', async (_req, res) => {
  try {
    const dishName: string = _req.body.dish;
    const extraName: string = _req.body.extra;
    const token = _req.body.token ? _req.body.token : null;
    
    if (token !== null) {
      console.log('Token: ' + token);
      let userID = await getUserIdResto(token);
      console.log('UserID: ' + userID);
      if (userID === false) {
        console.log('looking here');
        userID = await getUserId(token);
      }
      if (userID === false) {
        return res.status(404)
          .send('Post Images failed: User not found');
      }

      await saveImageToDB(
        _req.body.image.filename,
        _req.body.image.contentType,
        _req.body.image.size,
        _req.body.image.base64);

      const id: number = await getLatestID();
      console.log('ID: ' + userID);
      await addRestoProfilePic(parseInt(userID as string), id);
      return res.status(200)
        .send('Post Images for User successfully');
    }

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
    return res.status(200)
      .send('Post Images for restaurant successfully');

  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Post Images failed');
  }
});

router.delete('/', async (_req, res) => {
  try {
    const dishName: string = _req.body.dish;
    const extraName: string = _req.body.extra;
    const error: string = await errorHandlingImageDelete(_req);
    if (error) {
      console.log(error);
      return res.status(404)
        .send(error);
    }
    if (dishName) {
      await unlinkImageFromRestaurantDish(
        _req.body.restaurant, _req.body.dish, _req.body.imageId);
      await deleteImageFromDB(_req.body.imageId);
      return res.status(200)
        .send('Delete Image for dish successfully');
    }
    if (extraName) {
      await unlinkImageFromRestaurantExtra(
        _req.body.restaurant, _req.body.extra, _req.body.imageId);
      await deleteImageFromDB(_req.body.imageId);
      return res.status(200)
        .send('Delete Image for extra successfully');
    }
    await unlinkImageFromRestaurant(_req.body.restaurant, _req.body.imageId);
    await deleteImageFromDB(_req.body.imageId);
    return res.status(200)
      .send('Delete Image for restaurant successfully');
  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Delete Images failed');
  }
});

router.put('/', async (_req, res) => {
  try {
    const error: string = await errorHandlingImageChange(_req);

    if (error) {
      return res.status(404)
        .send(error);
    }
    const image = await changeImageById(_req.body.imageId, _req.body.image);
    if (image) {
      return res.status(200)
        .send(image);
    }
  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Put Images failed');
  }
});

router.get('/latestID', async (_req, res) => {
  try {
    const id = await getLatestID();
    return res.status(200)
      .send(id.toString());
  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Get latest ID failed');
  }
});

export default router;
