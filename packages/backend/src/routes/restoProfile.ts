import express from 'express';

import 'dotenv/config';
import {
  addRestoProfilePic, deleteRestoProfilePic, editRestoProfilePic,
  getRestoProfileDetails,
  getUserIdResto, getUserRestoCookiePreferences,
  updateRestoPassword, setUserRestoCookiePreferences,
  updateRestoProfileDetails, updateRecoveryPasswordResto,
  addRestoChain, deleteRestoChain
} from '../controllers/userRestoController';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await getRestoProfileDetails(userID as number);
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in GET '/api/profile' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const updateFields = req.body;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await updateRestoProfileDetails(userID as number,
      updateFields);
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in PUT '/api/profile' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/password', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await updateRestoPassword(userID as number,
      oldPassword, newPassword);
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in PUT '/api/profile/password' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/updateRecoveryPassword', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const newPassword = req.body.newPassword;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const returnValue = await updateRecoveryPasswordResto(Number(userID), newPassword);
    return res.status(200)
      .send(returnValue);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in PUT '/api/profile/updateRecoveryPassword' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/image', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const pictureId = req.body.pictureId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await addRestoProfilePic(userID as number, pictureId);
    return res.status(200)
      .send(true);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in POST '/api/profile/image' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/restoChain', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const name = req.body.restoChainName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await addRestoChain(userID as number, name as string);
    return res.status(200)
      .send(true);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in POST '/api/profile/image' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/restoChain', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const restoChainName = req.body.restoChainName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await deleteRestoChain(userID as number, restoChainName);
    return res.status(200)
      .send(true);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in DELETE '/api/profile/image' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/image', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const oldPictureId = req.body.oldPictureId;
    const newPictureId = req.body.newPictureId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await editRestoProfilePic(userID as number, oldPictureId, newPictureId);
    return res.status(200)
      .send(true);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in PUT '/api/profile/image' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/image', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const pictureId = req.body.pictureId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await deleteRestoProfilePic(userID as number, pictureId);
    return res.status(200)
      .send(true);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in DELETE '/api/profile/image' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/setCookiePref', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);
    const data = req.body;
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const response = await setUserRestoCookiePreferences(<number>userID, data);
    return res.status(200)
      .send(response);

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in POST '/api/profile/setCookiePref' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/getCookiePref', async (req, res) => {
  const userToken = String(req.query.key);
  const userID = await getUserIdResto(userToken);
  if (userID === false) {
    // If user ID is not found, return 404 Not Found
    return res.status(404)
      .send({ error: 'User not found' });
  }
  const response = await getUserRestoCookiePreferences(<number>userID);
  return res.status(200)
    .send(response);
});

export default router;
