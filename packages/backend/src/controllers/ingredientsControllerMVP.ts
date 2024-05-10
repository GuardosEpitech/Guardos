import mongoose from 'mongoose';

import {ingredientsSchemaMVP} from '../models/ingredientsInterfaces';

export async function createNewIngredient(name: string, id: number,
  allergens: string[]) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  const upload = new IngredientSchema({
    _id: id,
    name: name,
    allergens: allergens,
  });
  await upload.save();
  console.log('Ingredient ' + name + ' saved ' + ' with id ' + id);
}

export async function getAllIngredients() {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  return IngredientSchema.find();
}

export async function getIngredientByName(name: string) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  return IngredientSchema.find({name: name});

}

export async function deleteIngredient(name: string, id: number) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  await IngredientSchema.deleteOne({_id: id});
  console.log('Ingredient ' + name + ' deleted ' + ' with id ' + id);

}

export async function findMaxIndexIngredients() {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  const ingredients = await IngredientSchema.find()
    .sort({_id: -1})
    .limit(1);
  if (ingredients.length === 0) return 0;
  return ingredients[0]._id;
}
