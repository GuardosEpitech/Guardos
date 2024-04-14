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
  getImageById, changeImageById,
} from '../controllers/imageController';
import {
  errorHandlingRestoDishImage,
  errorHandlingImageChange,
  errorHandlingRestoDishImageDelete,
  errorHandlingImage, errorHandlingImageDelete
} from '../middleware/imagesMiddleWare';
import {
  addProfilePicture, deleteProfilePicture, getUserId
} from '../controllers/userController';
import {
  addRestoProfilePic, deleteRestoProfilePic, getUserIdResto
} from '../controllers/userRestoController';

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
    const error: string = await errorHandlingRestoDishImage(_req);
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

router.post('/profile', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send('User not found');
    }
    const error: string = errorHandlingImage(req);
    if (error) {
      return res.status(404)
        .send(error);
    }

    await saveImageToDB(
      req.body.image.filename,
      req.body.image.contentType,
      req.body.image.size,
      req.body.image.base64);

    const id: number = await getLatestID();
    await addProfilePicture(userID, id);
    return res.status(200)
      .send({message: id});
  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Post Images failed');
  }
});

router.post('/restoProfile', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send('Resto user not found');
    }
    const error: string = errorHandlingImage(req);
    if (error) {
      return res.status(404)
        .send(error);
    }

    await saveImageToDB(
      req.body.image.filename,
      req.body.image.contentType,
      req.body.image.size,
      req.body.image.base64);

    const id: number = await getLatestID();
    await addRestoProfilePic(userID as number, id);
    return res.status(200)
      .send({message: id});
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
    const error: string = await errorHandlingRestoDishImageDelete(_req);
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

router.delete('/profile', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send('User not found');
    }

    await deleteProfilePicture(userID);
    await deleteImageFromDB(req.body.imageId);
    return res.status(200)
      .send('Delete Image for profile successfully');
  } catch (e) {
    console.error(e);
    return res.status(404)
      .send('Delete Images failed');
  }
});

router.delete('/restoProfile', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send('Resto user not found');
    }
    const error: string = await errorHandlingImageDelete(req);
    if (error) {
      return res.status(404)
        .send(error);
    }

    await deleteRestoProfilePic(userID as number, req.body.imageId);
    await deleteImageFromDB(req.body.imageId);
    return res.status(200)
      .send('Delete Image for resto profile successfully');
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
