import mongoose from 'mongoose';

import { getRestaurantByName } from '../controllers/restaurantController';
import { restaurantSchema } from '../models/restaurantInterfaces';

export async function checkIfRestaurantExists(restaurantName: string) {
  const restaurant = await getRestaurantByName(restaurantName);
  return !!restaurant;
}

export async function findMaxIndexRestaurants() {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find()
    .sort({ _id: -1 })
    .limit(1);
  if (restaurants.length === 0) return 0;
  return restaurants[0]._id as number;
}
