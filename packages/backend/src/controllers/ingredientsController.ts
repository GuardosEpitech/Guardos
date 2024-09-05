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
        'gluten_free': 'Gluten-containing grains',
        'crustacean_free': 'Crustaceans and crustacean products',
        'egg_free': 'Eggs and egg products',
        'fish_free': 'Fish and fish products',
        'peanut_free': 'Peanuts and peanut products',
        'soy_free': 'Soy and soy products',
        'dairy_free': 'Milk and milk products (including lactose)',
        'tree_nut_free': 'Tree nuts',
        'celery_free': 'Celery and celery products',
        'mustard_free': 'Mustard and mustard products',
        'sesame_free': 'Sesame seeds and sesame products',
        'sulphite_free': 'Sulphur dioxide and sulphites',
        'lupine_free': 'Lupine',
        'mollusk_free': 'Mollusks (shellfish)'
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

// we usually search by user query (types in ingredient name to find it)
export async function getIngredientByName(name: string) {
  name = name.toLowerCase();
  return IngredientSchema.find({ name });
}

export async function findMaxIndexIngredients() {
  const ingredients = await IngredientSchema.find()
    .sort({ _id: -1 })
    .limit(1);
  if (ingredients.length === 0) return 0;
  return ingredients[0]._id;
}
