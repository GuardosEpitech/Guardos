import {IDishesCommunication} from '../models/communicationInterfaces';
import mongoose from 'mongoose';
import {restaurantSchema} from '../models/restaurantInterfaces';
import { removeDishDiscount } from '../controllers/dishesController';

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

export async function checkIfDishExistsByID(
  restaurantID: number, dishID: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({_id: restaurantID});
    if (!restaurant) {
      console.log('Restaurant not found');
      return false;
    }
    const dishExists = restaurant.dishes.some(dish => dish.uid === dishID);
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

function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(23, 59, 0, 0);
  return date;
}

export async function removeAllExpiredDiscounts() {
  try {
    const now = new Date();

    const Restaurants = mongoose.model('Restaurant', restaurantSchema);
    const restaurants = await Restaurants.find();

    if (!restaurants) {
      console.log('No restaurants found');
      return false;
    }

    for (const restaurant of restaurants) {
      for (const dish of restaurant.dishes) {
        const validTillDate = dish.validTill;
        if (validTillDate) {
          const expiredDate = parseDate(dish.validTill as string);

          if (now > expiredDate) {
            await removeDishDiscount(restaurant._id as number, dish as IDishesCommunication, restaurant.userID as number);
          }
        }
        
      }
    }
  } catch (error) {
    console.log('Error while removing expired discounts: ', error);
  }
}