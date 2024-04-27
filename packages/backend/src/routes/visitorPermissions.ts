import express from 'express';
import { getUserId } from '../controllers/userController';
import {
  getVisitorPermissions,
  addVisitorPermission,
  removePermissions,
  deleteAllPermissions,
} from '../controllers/visitorPermissionController';

const router = express.Router();

const availablePermissions = ['default', 'basicSubscription', 'premiumUser'];

router.get('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const profileDetails = await getVisitorPermissions(userID);
    return res.status(200)
      .send(profileDetails);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in GET '/api/permissions/visitor' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/addPermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const { permissions } = req.body;
    // filters for only available permissions, ignore the rest
    const validPermissions = permissions.filter((perm: string) =>
      availablePermissions.includes(perm)
    );

    if (validPermissions.length === 0) {
      return res.status(400)
        .send({ error: 'No valid permissions provided' });
    }

    const updatedUser = await addVisitorPermission(userID, validPermissions);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in POST '/api/permissions/visitor/addPermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/removePermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const { permissions } = req.body;
    // filters for only available permissions, ignore the rest
    const validPermissions = permissions.filter((perm: string) =>
      availablePermissions.includes(perm)
    );

    const updatedUser = await removePermissions(userID, validPermissions);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in PUT '/api/permissions/visitor/removePermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteAllPermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserId(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const updatedUser = await deleteAllPermissions(userID);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in DELETE '/api/permissions/visitor/deleteAllPermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
