import mongoose from 'mongoose';

import {ingredientsSchemaMVP} from '../models/ingredientsInterfaces';

export async function createNewIngredient(name: string, id: number, allergens: string[]) {
  const IngredientSchema = mongoose.model('IngredientsMVP', ingredientsSchemaMVP);

  const existingIngredient = await IngredientSchema.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
  if (existingIngredient) {
    console.log(`Ingredient with name ${name} already exists with id ${existingIngredient._id}`);
    return { status: 400, message: `Ingredient with name ${name} already exists.` };
  }

  const upload = new IngredientSchema({
    _id: id,
    name: name,
    allergens: allergens,
  });

  try {
    await upload.save();
    console.log('Ingredient ' + name + ' saved ' + ' with id ' + id);
    return { status: 200, message: 'Ingredient saved successfully.' };
  } catch (error) {
    console.error('Error saving ingredient:', error);
    return { status: 500, message: 'Internal Server Error.' };
  }
}

export async function getAllIngredients() {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchemaMVP);
  return IngredientSchema.find();
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
