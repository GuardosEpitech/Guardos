import { Request } from 'express';
import { findIngredientInfos } from '../middleware/allergensMiddleware';

export async function detectAllergens(req: Request) {
  try {
    let products: string[] = [];
    if (req.body.dish) {
      products = req.body.dish.products;
    } else if (req.body.name) {
      products = [req.body.name.toString()];
    }

    if (products.length === 0) {
      return { status: 400, data: 'No ingredients provided' };
    }
    const answer = await detectAllergensByIngredients(products);
    if (answer.includes('No allergens found')) {
      return { status: 404, data: answer };
    }
    return { status: 200, data: answer };
  } catch (error) {
    console.error('Allergen detection error:', error);
    return { status: 500, data: 'Failed to detect allergens' };
  }
}

async function detectAllergensByIngredients(ingredient: string[]) {
  try {
    const ingredientsInfo = [];
    for (const item of ingredient) {
      const answer = await findIngredientInfos(item);
      if (!answer) {
        return 'No allergens found for ingredient: ' + item;
      }
      ingredientsInfo.push(answer);

    }
    return ingredientsInfo;
  } catch (error) {
    console.error('Allergen detection error:', error);
    throw new Error('Failed to detect allergens');
  }
}
