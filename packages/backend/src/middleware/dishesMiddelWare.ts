import {IDishesCommunication} from '../models/communicationInterfaces';
import mongoose from 'mongoose';
import {restaurantSchema} from '../models/restaurantInterfaces';

export function checkIfNameExists(req: IDishesCommunication) {
  if (!req.name) {
    console.log('Missing name');
    return false;
  }
  return true;
}

export async function checkIfDishExists(
  restaurantName: string, dishName: string) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({name: restaurantName});
    if (!restaurant) {
      console.log('Restaurant not found');
      return false;
    }
    const dishExists = restaurant.dishes.some(dish => dish.name === dishName);
    return dishExists;
  } catch (error) {
    console.error('Error in checkIfDishExists:', error);
    return false;
  }
}

export async function checkIfExtraExists(
  restaurantName: string, extraName: string) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      console.log('Restaurant not found');
      return false;
    }

    const extraExists =
        restaurant.extras.some(extra => extra.name === extraName);
    return extraExists;
  } catch (error) {
    console.error('Error in checkIfExtraExists:', error);
    return false;
  }
}
