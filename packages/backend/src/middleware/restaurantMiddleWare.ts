import mongoose from 'mongoose';

import {
  getRestaurantByName, getRestaurantByID, getUserRestaurantByName
} from '../controllers/restaurantController';
import { restaurantSchema } from '../models/restaurantInterfaces';

export async function checkIfRestaurantExists(restaurantName: string) {
  const restaurant = await getRestaurantByName(restaurantName);
  return !!restaurant;
}

export async function checkIfUserRestaurantExists(restaurantName: string, userID: number) {
  const restaurant = await getUserRestaurantByName(restaurantName, userID);
  return !!restaurant;
}

export async function checkIfRestaurantExistsWithId(restaurantID: number) {
  const restaurant = await getRestaurantByID(restaurantID);
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
