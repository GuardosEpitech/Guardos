import express from 'express';

import 'dotenv/config';
import {
  addProfilePicture,
  addSavedFilter, deleteProfilePicture, deleteSavedFilter,
  editProfilePicture, editSavedFilter,
  getProfileDetails,
  getUserId,
  updatePassword,
  updateProfileDetails
} from '../controllers/userController';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await getProfileDetails(userID);
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
    const userID = await getUserId(userToken);
    const updateFields = req.body;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await updateProfileDetails(userID, updateFields);
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
    const userID = await getUserId(userToken);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await updatePassword(userID, oldPassword, newPassword);
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

router.post('/filter', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const filter = req.body;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await addSavedFilter(userID, filter);
    return res.status(200)
      .send(profileDetails.savedFilter);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in POST '/api/profile/filter' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/filter', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const filterId = req.body.filterId;
    const updateFields = req.body.updateFields;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await editSavedFilter(userID, filterId, updateFields);
    if (profileDetails === null) {
      return res.status(404)
        .send({error: 'Filter with that id not found'});
    }
    return res.status(200)
      .send(profileDetails.savedFilter);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in PUT '/api/profile/filter' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/filter', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const filterId = req.body.filterId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await deleteSavedFilter(userID, filterId);
    if (profileDetails === null) {
      return res.status(404)
        .send({error: 'Filter with that id not found'});
    }
    return res.status(200)
      .send(profileDetails.savedFilter);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in DELETE '/api/profile/filter' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/image', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const pictureId = req.body.pictureId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await addProfilePicture(userID, pictureId);
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

router.put('/image', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const pictureId = req.body.pictureId;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await editProfilePicture(userID, pictureId);
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
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    await deleteProfilePicture(userID);
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

export default router;
