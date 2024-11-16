import mongoose from 'mongoose';
import {IIngredientsCommunication} from '../models/communicationInterfaces';
import {ingredientsSchemaMVP} from '../models/ingredientsInterfaces';
import {findMaxIndexIngredients} from '../controllers/ingredientsController';

export async function checkIfIdExists(id: number) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  return await IngredientSchema.findOne({_id: id})
    .then((result) => {
      return result;
    });
}

export async function checkIfNameAndIdExistsIngredients(
  req: IIngredientsCommunication) {

  const id = req.id ? req.id : (await findMaxIndexIngredients() + 1);
  if (!req.name || !id) {
    console.log('Missing name or id');
    return false;
  }
  const ingredient = await checkIfIdExists(id);

  return !ingredient;
}
