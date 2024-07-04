import * as express from 'express';

// import { addRestoProduct } from '../controllers/restaurantController';
// import { checkIfNameAndIdExistsIngredients, checkIfIdExists }
//   from '../middleware/ingredientsMiddleWare';
import {
  getAllIngredients,
  // deleteIngredient, createNewIngredient
  // findMaxIndexIngredients, getIngredientByName
} from '../controllers/ingredientsControllerMVP';
// import { checkIfRestaurantExists } from '../middleware/restaurantMiddleWare';
// import { IIngredientsCommunication } from '../models/communicationInterfaces';
// import {detectAllergens} from '../controllers/allergenDetectionController';
// import {isArrayOfStrings} from '../controllers/ingredientsController';

const router = express.Router();

router.get('/', async (_req, res) => {
  const ingredients = await getAllIngredients();
  res.status(200)
    .send(ingredients);
});

// router.post('/', async (req, res) => {
//   try {
//     if (await checkIfNameAndIdExistsIngredients(
//       req.body as IIngredientsCommunication)) {
//       const id =
//         req.body.id ? req.body.id : (await findMaxIndexIngredients() + 1);
//       const allergensDB = await detectAllergens(req);
//       if (allergensDB.status !== 200) {
//         return allergensDB;
//       }
//       const allergens: [string] = allergensDB.data[0].allergens;
//
//       if (isArrayOfStrings(req.body.allergens)) {
//         allergens.push(...req.body.allergens);
//       } else if (typeof req.body.allergens === 'string') {
//         allergens.push(req.body.allergens);
//       }
//
//       await createNewIngredient(req.body.name, id, allergens);
//       await addRestoProduct({
//         name: req.body.name,
//         allergens: allergens,
//         ingredients: req.body.ingredients,
//       }, req.body.restoName);
//       if (!await checkIfRestaurantExists(req.body.restoName)) {
//         return res.status(200)
//           .send('Coudnt find restaurant named ' +
//             req.body.restoName +
//             ' but added ingredient to ingredients database');
//       }
//       res.status(200)
//         .send('Ingredient '
//           + req.body.name + ' saved ' + ' with id ' + id);
//     } else {
//       res.status(400)
//         .send('Missing name or wrong id for ingredient');
//     }
//   } catch (error) {
//     console.error("Error in 'ingredients' route:", error);
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });
//
// router.delete('/', async (req, res) => {
//   try {
//     const id = req.body.id ? req.body.id
//       : (await getIngredientByName(req.body.name));
//
//     if (await checkIfIdExists(id)) {
//       await deleteIngredient(req.body.name, id);
//       res.status(200)
//         .send('Ingredient '
//           + req.body.name + ' deleted ' + ' with id ' + id);
//     } else {
//       res.status(400)
//         .send('Ingredient not found');
//     }
//   } catch (error) {
//     console.error("Error in 'ingredients' route:", error);
//     return res.status(500)
//       .send({ error: 'Internal Server Error' });
//   }
// });

export default router;
