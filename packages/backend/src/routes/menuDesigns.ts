import * as express from 'express';

import {
  getAllMenuDesigns
  // updateOrCreateMenuDesigns, getMaxMenuDesignsId, deleteMenuDesigns
} from '../controllers/menuDesignsController';
import {getUserIdResto} from '../controllers/userRestoController';

const router = express.Router();

router.get('/', async (req, res) => {
  const userToken = String(req.query.key);
  const userID = await getUserIdResto(userToken);

  if (userID === false) {
    // If user ID is not found, return 404 Not Found
    return res.status(404)
      .send({ error: 'User not found' });
  }

  const menuDesigns = await getAllMenuDesigns();
  return res.status(200)
    .send(menuDesigns);
});

// router.put('/', async (req, res) => {
//   try {
//     const userToken = String(req.query.key);
//     const userID = await getUserIdResto(userToken);
//
//     if (userID === false) {
//       // If user ID is not found, return 404 Not Found
//       return res.status(404)
//         .send({ error: 'User not found' });
//     }
//
//     const menuDesignId = req.body._id ? req.body._id : -2;
//     const menuDesignName = req.body.name;
//
//     if (menuDesignName === '') {
//       return res.status(404)
//         .send({ error: 'Menu name not given' });
//     }
//
//     const maxMenuDesignId = await getMaxMenuDesignsId();
//     const menuDesignAnswer = await updateOrCreateMenuDesigns(menuDesignId,
//       menuDesignName, maxMenuDesignId);
//     return res.status(200)
//       .send(menuDesignAnswer);
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error in PUT '/api/menuDesign' route:", error);
//
//     // Return a 500 Internal Server Error for other types of errors
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });
//
// router.delete('/', async (req, res) => {
//   try {
//     const userToken = String(req.query.key);
//     const userID = await getUserIdResto(userToken);
//
//     if (userID === false) {
//       // If user ID is not found, return 404 Not Found
//       return res.status(404)
//         .send({ error: 'User not found' });
//     }
//
//     const menuDesignId = req.body._id;
//
//     if (menuDesignId < 0) {
//       return res.status(404)
//         .send({ error: 'Menu Design not found' });
//     }
//
//     await deleteMenuDesigns(menuDesignId);
//     return res.status(200)
//       .send(true);
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error in Delete '/api/menuDesign' route:", error);
//
//     // Return a 500 Internal Server Error for other types of errors
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });

export default router;
