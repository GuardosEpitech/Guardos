import express from 'express';

import 'dotenv/config';
import {
  addProfilePicture,
  addSavedFilter, deleteProfilePicture, deleteSavedFilter,
  editProfilePicture, editSavedFilter,
  getProfileDetails, getSavedFilter, getSavedFilters,
  getUserId, getUserCookiePreferences,
  updatePassword, setUserCookiePreferences,
  updateProfileDetails, updateRecoveryPassword, isNameOrEmailTaken
} from '../controllers/userController';
import {
  getVisitorPermissions
} from '../controllers/visitorPermissionController';

const router = express.Router();

const premiumUserFilterAmount = 3;
const basicUserFilterAmount = 2;
const defaultUserFilterAmount = 1;

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

    const errorArray = await isNameOrEmailTaken(userID,
      updateFields.username, updateFields.email);

    if (errorArray.includes(true)) {
      return res.status(207)
        .send(errorArray);
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

router.put('/updateRecoveryPassword', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const newPassword = req.body.newPassword;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const returnValue = await updateRecoveryPassword(userID, newPassword);
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

router.get('/filter', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await getSavedFilters(userID);
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in Get '/api/profile/filter' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.get('/filter/id', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const filterName = req.body.filterName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await getSavedFilter(userID, filterName);
    if (profileDetails === null) {
      return res.status(404)
        .send({error: 'Filter with that name not found'});
    }
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in Get '/api/profile/filter/id' route:", error);

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
    const filterName = filter.filterName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    if (filterName === null || filterName === '' ||
      (await getSavedFilter(userID, filterName)) !== undefined) {
      return res.send('Invalid name or filterName already exists.');
    }

    const permissionsResponse = await getVisitorPermissions(userID);
    const permissions : string[] = permissionsResponse ? permissionsResponse : [];
    let filterLimit = premiumUserFilterAmount;

    if (!permissions.includes('premiumUser')) {
      filterLimit = basicUserFilterAmount;
      if (!permissions.includes('basicSubscription')) {
        filterLimit = defaultUserFilterAmount;
      }
    }

    const savedFilters = await getSavedFilters(userID);
    if (savedFilters.length >= filterLimit) {
      return res.status(203)
        .send('Reached the maximum amount of saved filters.');
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

router.get('/filterLimit', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found from filterLimit' });
    }

    const permissionsResponse = await getVisitorPermissions(userID);
    const permissions : string[] = permissionsResponse ? permissionsResponse : [];

    let filterLimit = premiumUserFilterAmount;

    if (!permissions.includes('premiumUser')) {
      filterLimit = basicUserFilterAmount;
      if (!permissions.includes('basicSubscription')) {
        filterLimit = defaultUserFilterAmount;
      }
    }

    return res.status(200)
      .send({filterLimit: filterLimit});
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in Get '/api/profile/filterLimit' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/filter', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const updateFields = req.body;
    const filterName = updateFields.filterName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await editSavedFilter(userID, filterName, updateFields);
    if (profileDetails === null) {
      return res.status(404)
        .send({error: 'Filter with that name not found'});
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
    const filterName = req.body.filterName;

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await deleteSavedFilter(userID, filterName);
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

router.post('/setCookiePref', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);
    const data = req.body;
    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const response = await setUserCookiePreferences(userID, data);
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
  const userID = await getUserId(userToken);
  if (userID === false) {
    // If user ID is not found, return 404 Not Found
    return res.status(404)
      .send({ error: 'User not found' });
  }
  const response = await getUserCookiePreferences(userID);
  return res.status(200)
    .send(response);
})

export default router;
