import express from 'express';
import {getUserIdResto} from '../controllers/userRestoController';
import {
  addRestoPermission, deleteAllRestoPermissions,
  getRestoPermissions,
  removeRestoPermissions
} from '../controllers/restoPermissionController';

const router = express.Router();

const availablePermissions = ['default', 'basicSubscription', 'premiumUser'];

router.get('/', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      // If user ID is not found, return 404 Not Found
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const permissions = await getRestoPermissions(userID as number);
    return res.status(200)
      .send(permissions);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in GET '/api/permissions/resto' route:", error);

    // Return a 500 Internal Server Error for other types of errors
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.post('/addPermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

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

    const updatedUser = await addRestoPermission(userID as number,
      validPermissions);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in POST '/api/permissions/resto/addPermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.put('/removePermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const { permissions } = req.body;
    // filters for only available permissions, ignore the rest
    const validPermissions = permissions.filter((perm: string) =>
      availablePermissions.includes(perm)
    );

    const updatedUser = await removeRestoPermissions(userID as number,
      validPermissions);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in PUT '/api/permissions/resto/removePermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteAllPermissions', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const userID = await getUserIdResto(userToken);

    if (userID === false) {
      return res.status(404)
        .send({ error: 'User not found' });
    }

    const updatedUser = await deleteAllRestoPermissions(userID as number);
    return res.status(200)
      .send(updatedUser);
  } catch (error) {
    console.error("Error in DELETE '/api/permissions/resto/deleteAllPermissions' route:", error);
    return res.status(500)
      .send({ error: 'Internal Server Error' });
  }
});

export default router;
