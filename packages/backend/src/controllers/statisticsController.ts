import mongoose from 'mongoose';
import {restaurantSchema} from '../models/restaurantInterfaces';
import {IStatistics} from '../../../shared/models/restaurantInterfaces';

function handleAllergenList(allergenList: string[], restaurant: any) {
  const allergenListUpdate = restaurant.statistics.userAllergens;
  allergenList.forEach((allergen) => {
    const existingAllergen = allergenListUpdate.find(
      (allergenUpdate: { allergen: string; count: number; }) =>
        allergenUpdate.allergen === allergen
    );
    if (existingAllergen) {
      existingAllergen.count++;
    } else {
      allergenListUpdate.push({ allergen: allergen, count: 1 });
    }
  });
  return allergenListUpdate;
}

function handleDislikedIngredientsList(
  dislikedIngredientsList: string[],
  restaurant: any
) {
  if (!dislikedIngredientsList) return [];
  const dislikedIngredientsListUpdate =
      restaurant.statistics.userDislikedIngredients;
  dislikedIngredientsList.forEach((ingredient) => {
    const existingIngredient = dislikedIngredientsListUpdate.find(
      (ingredientUpdate: { ingredient: string; count: number; }) =>
        ingredientUpdate.ingredient === ingredient
    );
    if (existingIngredient) {
      existingIngredient.count++;
    } else {
      dislikedIngredientsListUpdate.push({
        ingredient: ingredient,
        count: 1
      });
    }
  });
  return dislikedIngredientsListUpdate;
}

function handleClicks(restaurant: any) {
  const date = new Date();
  const currentMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
  const currentWeek = getISOWeekString(date);

  if (!restaurant.statistics.totalClicks) {
    restaurant.statistics.totalClicks = 0;
  }
  restaurant.statistics.totalClicks++;

  if (restaurant.statistics.updateMonth !== currentMonth) {
    restaurant.statistics.clicksThisMonth = 1;
    restaurant.statistics.updateMonth = currentMonth;
  } else {
    restaurant.statistics.clicksThisMonth++;
  }

  if (restaurant.statistics.updateWeek !== currentWeek) {
    restaurant.statistics.clicksThisWeek = 1;
    restaurant.statistics.updateWeek = currentWeek;
  } else {
    restaurant.statistics.clicksThisWeek++;
  }
}

// Helper function to get the ISO week string in "YYYY-WW" format
function getISOWeekString(date: Date): string {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tempDate.getTime()
      - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${tempDate.getFullYear()}-${weekNo}`;
}

export async function updateRestoUserStatistics(
  restaurantId: number,
  allergenList: string[],
  dislikedIngredientsList: string[]
) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurant = await Restaurant.findOne({ _id: restaurantId });
  if (!restaurant) {
    return null;
  }
  handleClicks(restaurant);
  restaurant.statistics.userAllergens =
      handleAllergenList(allergenList, restaurant);
  restaurant.statistics.userDislikedIngredients =
      handleDislikedIngredientsList(dislikedIngredientsList, restaurant);

  await restaurant.save();
  return restaurant;
}

export async function getStatisticsForResto(userId: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find({ userID: userId });
  if (!restaurants) {
    return null;
  }
  const statistics = [];
  for (const restaurant of restaurants) {
    //@ts-ignore
    const statistic :IStatistics = {
      restoId: restaurant._id || 0,
      //@ts-ignore
      totalClicks: restaurant.statistics.totalClicks || 0,//@ts-ignore
      clicksThisMonth: restaurant.statistics.clicksThisMonth || 0,//@ts-ignore
      clicksThisWeek: restaurant.statistics.clicksThisWeek || 0,//@ts-ignore
      updateMonth: restaurant.statistics.updateMonth || '', //@ts-ignore
      updateWeek: restaurant.statistics.updateWeek || '',//@ts-ignore
      userAllergens: restaurant.statistics.userAllergens || [],//@ts-ignore
      userDislikedIngredients: restaurant.statistics.userDislikedIngredients || []
    };
    statistics.push(statistic);
  }
  return statistics;
}
