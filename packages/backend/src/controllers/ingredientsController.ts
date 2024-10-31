import mongoose from 'mongoose';
import {ingredientsSchema} from '../models/ingredientsInterfaces';

const IngredientSchema = mongoose.model('Ingredients', ingredientsSchema);

export function isArrayOfStrings(value: any): value is string[] {
  return Array.isArray(value) &&
      value.every(element => typeof element === 'string');
}

export function findRelevantAllergens(healthLabels: string[]): [string] {
  const allergenMap: { [key: string]: string } =
      {
        'gluten_free': 'gluten',
        'crustacean_free': 'crustaceans',
        'egg_free': 'eggs',
        'fish_free': 'fish',
        'peanut_free': 'peanuts',
        'soy_free': 'soybeans',
        'dairy_free': 'milk',
        'tree_nut_free': 'tree nuts',
        'celery_free': 'celery',
        'mustard_free': 'mustard',
        'sesame_free': 'sesame',
        'sulphite_free': 'sulphides',
        'lupine_free': 'lupin',
        'mollusk_free': 'molluscs'
      };
  const presentLabels = new Set(healthLabels.map(label => label.toLowerCase()));
  const presentAllergens: [string] = [''];
  presentAllergens.pop(); // remove the empty string from the array initialization
  
  for (const [label, allergen] of Object.entries(allergenMap)) {
    if (!presentLabels.has(label)) {
      presentAllergens.push(allergen);
    }
  }

  return presentAllergens;
}

export async function createNewIngredient(foodID: string, name: string,
  nutrients: object, healthLabels: [string], allergens: [string]) {
  const id = await findMaxIndexIngredients() + 1;
  name = name.toLowerCase();
  const upload = new IngredientSchema({
    _id: id,
    foodID,
    name,
    nutrients,
    healthLabels,
    allergens
  });
  await upload.save();
  console.log('Ingredient ' + name + ' saved with id ' + id);
}

export async function getAllIngredients() {
  return IngredientSchema.find();
}

export async function getIngredientByName(name: string) {
  name = name.toLowerCase();
  return IngredientSchema.find({ name });
}

export async function getIngredientById(id: string) {
  return IngredientSchema.find({ foodID: id });
}

export async function deleteIngredient(name: string, id: string) {
  await IngredientSchema.deleteOne({ _id: id });
  console.log('Ingredient ' + name + ' deleted with id ' + id);
}

export async function findMaxIndexIngredients() {
  const ingredients = await IngredientSchema.find()
    .sort({ _id: -1 })
    .limit(1);
  if (ingredients.length === 0) return 0;
  return ingredients[0]._id;
}
