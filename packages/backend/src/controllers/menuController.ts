import {getRestaurantByID} from './restaurantController';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';
import {getProductByName} from './productsController';

export async function getMenuByRestoID(restoID: number, allergenList: string[],
  dislikedIngredientsList: string[]) {
  const restaurant : IRestaurantFrontEnd = await getRestaurantByID(restoID);
  const dislikedIngredients = dislikedIngredientsList ?
    dislikedIngredientsList.map(a => a.toLowerCase()) : [];

  if (!restaurant) {
    return null;
  }

  for (let i = 0; i < restaurant.categories.length; i++) {
    for (let j = 0; j < restaurant.categories[i].dishes.length; j++) {
      const dishAllergens = restaurant.categories[i].dishes[j].allergens
        .map(a => a.toLowerCase());
      let containsUnwantedAllergens = false;
      for (let k = 0; k < allergenList.length; k++) {
        if (dishAllergens.includes(allergenList[k].toLowerCase())) {
          containsUnwantedAllergens = true;
          break;
        }
      }
      const products = restaurant.categories[i].dishes[j].products
        .map(a => a.toLowerCase());
      let containsDislikedIngredients = false;
      for (let k = 0; k < products.length; k++) {
        const product = await getProductByName(products[k]);
        if (!product) continue;
        const ingredients = product.ingredients;
        for (let l = 0; l < ingredients.length; l++) {
          const ingredient = ingredients[l].toLowerCase();
          if (dislikedIngredients.includes(ingredient)) {
            containsDislikedIngredients = true;
            break;
          }
        }
      }

      // fitsPreference is only true if none of the prevented allergens (aka allergenList) are contained in the dish
      restaurant.categories[i].dishes[j].fitsPreference =
        !containsUnwantedAllergens && !containsDislikedIngredients;
    }
  }
  return restaurant.categories;
}
