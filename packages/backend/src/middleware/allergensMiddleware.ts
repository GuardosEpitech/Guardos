import axios from 'axios';
import {createNewIngredient, findRelevantAllergens, getIngredientByName}
  from '../controllers/ingredientsController';

export async function findIngredientInfos(ingredient: string) {
  const ingredientDb = await getIngredientByName(ingredient)
    .then((res) => {
      if (res.length === 0) {
        console.log('Ingredient not found in database. Fetching from API...');
      } else {
        console.log('Ingredient found in database:', res[0]);
        return res[0];
      }
    });
  
  if (ingredientDb) {
    return ingredientDb;
  }
  
  const options = {
    method: 'GET',
    url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser',
    params: {
      ingr: ingredient,
      'nutrition-type': 'cooking',
      'category[0]': 'generic-foods',
      'health[0]': 'alcohol-free'
    },
    headers: {
      'X-RapidAPI-Key': 'b0dea6ef9fmshcc51d7681fd2fa2p1f672ajsnc22796055f19',
      'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    if (response.data.parsed.length === 0) {
      return false;
    }
    const ingredient = await
    findIngredientByFoodId(response.data.parsed[0].food.foodId);
    console.log('response:', response.data.parsed[0].food);
    console.log('ingredient:', ingredient);
    const allergens: [string] = findRelevantAllergens(ingredient.healthLabels);
    await createNewIngredient(response.data.parsed[0].food.foodId,
      response.data.parsed[0].food.label,response.data.parsed[0].food.nutrients,
      ingredient.healthLabels, allergens);
    response.data.parsed[0].food.allergens = allergens;
    return response.data.parsed[0].food;
  } catch (error) {
    console.error(error);
  }
}

async function findIngredientByFoodId(id: string) {
  const options = {
    method: 'POST',
    url: 'https://api.edamam.com/api/food-database/v2/nutrients?app_id=03fb2598&app_key=%204202e57c0682963d957342f19b6746b1',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      ingredients: [
        {
          quantity: 1,
          foodId: id,
        }
      ]
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
