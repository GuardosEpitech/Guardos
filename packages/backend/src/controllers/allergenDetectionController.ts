import { Request } from 'express';
import { findIngredientInfos } from '../middleware/allergensMiddleware';
import { getProductsByUser } from './productsController';
import { IDishesCommunication } from '../models/communicationInterfaces';
import {findRelevantAllergens}
  from '../controllers/ingredientsController';

export async function detectAllergens(req: Request) {
  try {
    let products: string[] = [];
    if (req.body.dish) {
      products = req.body.dish.products;
    } else if (req.body.name) {
      products = [req.body.name.toString()];
    }

    if (!products || products.length === 0) {
      return { status: 400, data: 'No ingredients provided' };
    }
    const answer = await detectAllergensByProduct(products);

    if (answer.some(a => a?.includes('No allergens found'))) {
      console.log(answer);
      return { status: 404, data: answer };
    }

    return { status: 200, data: answer };
  } catch (error) {
    console.error('Allergen detection error:', error);
    return { status: 500, data: 'Failed to detect allergens' };
  }
}

export async function detectAllergensInDish(req: Request, userID: number) {
  try {
    let products: string[] = [];
    if (req.body.dish) {
      products = req.body.dish.products;
    } else if (req.body.name) {
      products = [req.body.name.toString()];
    }

    if (!products || products.length === 0) {
      return { status: 400, data: 'No ingredients provided' };
    }
    const allergens: string[] = [];
    const productObject = await getProductsByUser(userID);
    for (const prod of productObject) {
      if (products.includes(prod.name)) {
        for (const ing of prod.ingredients) {
          allergens.push(ing);
        }
      }
    }
    const answer = await detectAllergensByIngredients(allergens);

    if (answer.includes('No allergens found')) {
      console.log(answer);
      return { status: 404, data: answer };
    }

    return { status: 200, data: answer };
  } catch (error) {
    console.error('Allergen detection error:', error);
    return { status: 500, data: 'Failed to detect allergens' };
  }
}

export async function detectAllergensInDishEdit(
  dish: IDishesCommunication, userID: number) {
  try {
    let products: string[] = [];
    if (dish) {
      products = dish.products;
    } else if (dish.name) {
      products = [dish.name.toString()];
    }

    if (!products || products.length === 0) {
      return { status: 400, data: 'No ingredients provided' };
    }
    const ingredients: string[] = [];
    const productObject = await getProductsByUser(userID);
    for (const prod of productObject) {
      for (const ing of prod.ingredients) {
        ingredients.push(ing);
      }
    }
    const answer = await detectAllergensByIngredients(ingredients);

    if (answer.includes('No allergens found')) {
      console.log(answer);
      return { status: 404, data: answer };
    }

    return { status: 200, data: answer };
  } catch (error) {
    console.error('Allergen detection error:', error);
    return { status: 500, data: 'Failed to detect allergens' };
  }
}

async function detectAllergensByIngredients(ingredients: string[]) {
  try {
    if (!ingredients || ingredients.length === 0) {
      return ['No ingredients provided'];
    }
    const ingredientsInfo = [];
    for (const item of ingredients) {
      const answer = await findIngredientInfos(item);
      if (!answer) {
        ingredientsInfo.push(`No allergens found for ingredient: ${item}`);
      } else {
        const allergens = findRelevantAllergens(answer.healthLabels);

        for (let i = 0; i < allergens.length; i++) {
          ingredientsInfo.push(allergens[i]);
        }
      }
    }
    
    return ingredientsInfo;
  } catch (error) {
    console.error('Allergen detection error:', error);
    return ['Failed to detect allergens'];
  }
}

async function detectAllergensByProduct(ingredients: string[]) {
  try {
    if (!ingredients || ingredients.length === 0) {
      return ['No ingredients provided'];
    }
    const ingredientsInfo = [];
    for (const item of ingredients) {
      const answer = await findIngredientInfos(item);
      if (!answer) {
        ingredientsInfo.push(`No allergens found for ingredient: ${item}`);
      } else {
        ingredientsInfo.push(...answer.allergens);

      }
    }

    return ingredientsInfo;
  } catch (error) {
    console.error('Allergen detection error:', error);
    return ['Failed to detect allergens'];
  }
}
