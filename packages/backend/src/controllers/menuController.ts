import {getRestaurantByID} from './restaurantController';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';

export async function getMenuByRestoID(restoID: number, allergenList: string[]) {
  const restaurant : IRestaurantFrontEnd = await getRestaurantByID(restoID);

  for (let i = 0; i < restaurant.categories.length; i++) {
    for (let j = 0; j < restaurant.categories[i].dishes.length; j++) {
      const dishAllergens = restaurant.categories[i].dishes[j].allergens;
      let containsUnwantedAllergens = false;
      for (let k = 0; k < allergenList.length; k++) {
        if (dishAllergens.includes(allergenList[k])) {
          containsUnwantedAllergens = true;
          break;
        }
      }

      // fitsPreference is only true if none of the prevented allergens (aka allergenList) are contained in the dish
      restaurant.categories[i].dishes[j].fitsPreference =
        !containsUnwantedAllergens;
    }
  }
  return restaurant.categories;
}
