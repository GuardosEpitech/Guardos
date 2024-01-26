import mongoose from 'mongoose';

import { ICategoryFE } from '../../../shared/models/categoryInterfaces';
import { IDishBE, IDishFE } from '../../../shared/models/dishInterfaces';
import { IDishesCommunication } from '../models/communicationInterfaces';
import { restaurantSchema } from '../models/restaurantInterfaces';
import {getAllUserRestaurants} from './restaurantController';

export async function getDishesByRestaurantName(restaurantName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.find({ name: restaurantName }, 'dishes');
}

export async function getDishByName(restaurantName: string, dishName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurant = await Restaurant.findOne({ name: restaurantName });
  if (!restaurant) return null;
  return restaurant.dishes.find((dish) => dish.name === dishName);
}

export async function getDishByUser(loggedInUserId: number) {
  const restaurants = await getAllUserRestaurants(loggedInUserId);
  const dishes: IDishFE[] = [];
  for (const rest of restaurants) {
    for (const dish of rest.dishes) {
      const dishFE: IDishFE = {
        name: dish.name as string,
        description: dish.description as string,
        price: dish.price as number,
        pictures: [''],
        picturesId: [],
        allergens: [''],
        category: {} as ICategoryFE,
        resto: rest.name as string,
        products: dish.products as string[],
      };
      dishFE.pictures.pop();
      dishFE.allergens.pop();
      dishFE.picturesId?.pop();

      dishFE.category.foodGroup = dish.category.foodGroup as string;
      dishFE.category.extraGroup = dish.category.extraGroup as string[];
      dishFE.category.menuGroup = dish.category.menuGroup as string;
      for (const pict of dish.pictures) {
        dishFE.pictures.push(pict as string);
      }

      for (const allergen of dish.allergens) {
        dishFE.allergens.push(allergen as string);
      }

      dishes.push(dishFE);
    }
  }
  return dishes;
}

export async function getAllDishes() {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find();
  const dishes: IDishFE[] = [];
  for (const rest of restaurants) {
    for (const dish of rest.dishes) {
      const dishFE: IDishFE = {
        name: dish.name as string,
        description: dish.description as string,
        price: dish.price as number,
        pictures: [''],
        picturesId: [],
        allergens: [''],
        category: {} as ICategoryFE,
        resto: rest.name as string,
        products: dish.products as string[],
      };
      dishFE.pictures.pop();
      dishFE.allergens.pop();
      dishFE.picturesId?.pop();

      dishFE.category.foodGroup = dish.category.foodGroup as string;
      dishFE.category.extraGroup = dish.category.extraGroup as string[];
      dishFE.category.menuGroup = dish.category.menuGroup as string;
      for (const pict of dish.pictures) {
        dishFE.pictures.push(pict as string);
      }

      for (const allergen of dish.allergens) {
        dishFE.allergens.push(allergen as string);
      }

      dishes.push(dishFE);
    }
  }
  return dishes;
}

async function deleteDish(restaurantName: string, dishName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName },
    { $pull: { dishes: { name: dishName } } },
    { new: true }
  );
}

async function createDish(restaurantName: string, dish: IDishesCommunication) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName },
    { $push: { dishes: dish } },
    { new: true }
  );
}

export async function createNewDish(
  restaurantName: string, dishCom: IDishesCommunication) {
  const dish: IDishesCommunication = {
    name: dishCom.name,
    description: dishCom.description ? dishCom.description : '',
    price: dishCom.price ? dishCom.price : -1,
    products: dishCom.products ? dishCom.products : [''],
    pictures: dishCom.pictures ? dishCom.pictures : [''],
    allergens: dishCom.allergens ? dishCom.allergens : [''],
    category: dishCom.category ? dishCom.category : {
      menuGroup: '',
      foodGroup: '',
      extraGroup: [''],
    },
  };
  await createDish(restaurantName, dish);
  return dish;
}

export async function deleteDishByName(
  restaurantName: string, dishName: string) {
  await deleteDish(restaurantName, dishName);
  return dishName + ' deleted';
}

export async function updateDish(
  restaurantName: string, dish: IDishBE) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName, 'dishes.name': dish.name },
    { $set: { 'dishes.$': dish } },
    { new: true }
  );
}

export async function changeDishByName(
  restaurantName: string, dish: IDishesCommunication) {
  const oldDish = await getDishByName(restaurantName, dish.name);
  const newDish: IDishBE = {
    //if the new dish has a property, use it, else use the old one
    name: dish.name ? dish.name : oldDish.name as string,
    id: 6, // TODO: change that
    description: dish.description ?
      dish.description : oldDish.description as string,
    price: dish.price ? dish.price : oldDish.price as number,
    products: dish.products ? dish.products : oldDish.products as [string],
    pictures: dish.pictures ? dish.pictures : oldDish.pictures as [string],
    allergens: dish.allergens ? dish.allergens as [string] :
      oldDish.allergens as [string],
    category: dish.category ? dish.category : oldDish.category as {
      menuGroup: string;
      foodGroup: string;
      extraGroup: [string];
    }
  };
  await updateDish(restaurantName, newDish);
  return newDish;
}
