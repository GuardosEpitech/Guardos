import mongoose from 'mongoose';

import { ICategoryFE } from '../../../shared/models/categoryInterfaces';
import { IDishesCommunication } from '../models/communicationInterfaces';
import { IDishBE, IDishFE } from '../../../shared/models/dishInterfaces';
import { IMealType } from '../../../shared/models/mealTypeInterfaces';
import { IRestaurantBackEnd }
  from '../../../shared/models/restaurantInterfaces';
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

export async function getDishByID(restaurantID: number, dishID: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurant = await Restaurant.findOne({ _id: restaurantID });
  if (!restaurant) return null;
  return restaurant.dishes.find((dish) => dish.uid === dishID);
}

export async function getDishByUser(loggedInUserId: number) {
  const restaurants = await getAllUserRestaurants(loggedInUserId);
  const dishes: IDishFE[] = [];
  for (const rest of restaurants) {
    for (const dish of rest.dishes) {
      // prevent parsing empty objects - name is always mandatory
      if (!dish.name) {
        continue;
      }
      const dishFE: IDishFE = {
        name: dish.name as string,
        uid: dish.uid,
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

      dishFE.category = dishFE.category = dishFE.category ? dishFE.category : {
        menuGroup: '',
        foodGroup: '',
        extraGroup: [''],
      };
      if (dish.pictures) {
        for (const pict of dish.pictures) {
          dishFE.pictures.push(pict as string);
        }
      }

      if (dish.allergens) {
        for (const allergen of dish.allergens) {
          dishFE.allergens.push(allergen as string);
        }
      }

      if (dish.picturesId) {
        for (const pictId of dish.picturesId) {
          dishFE.picturesId.push(pictId as number);
        }
      }
      const dishExists = dishes.find((d) => d.name === dishFE.name);
      if (!dishExists) {
        dishes.push(dishFE);
      }
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
        uid: dish.uid as number,
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
  const { category } = dish;
  const menuGroup: string = category.menuGroup;
  const restaurant: IRestaurantBackEnd | null =
  await Restaurant.findOne({ name: restaurantName });
  const mealTypes: IMealType[] = restaurant?.mealType || [];
  const existingMealType = mealTypes
    .find((mealType) => mealType.name === menuGroup);
  if (!existingMealType) {
    let newMealType: IMealType;
    if (mealTypes.length === 0) {
      newMealType = { id: 1, name: menuGroup, sortId: 1 };
    } else {
      const highestSortId = 
      Math.max(...mealTypes.map((mealType) => mealType.sortId));
      const newSortId = highestSortId + 1;
      newMealType = { id: newSortId, name: menuGroup, sortId: newSortId };
    }
    await Restaurant.findOneAndUpdate(
      { name: restaurantName },
      { $push: { mealType: newMealType } },
      { new: true }
    );

    const dishes = restaurant?.dishes;
    const highestDishId =
      Math.max(...dishes.map((dish) => dish.uid));
    const newDishId = highestDishId + 1;
    dish.uid = newDishId;
  }
  return Restaurant.findOneAndUpdate(
    { name: restaurantName },
    { $push: { dishes: dish } },
    { new: true }
  );
}

export async function createNewDish(
  restaurantName: string, dishCom: IDishesCommunication, userID: number) {
  const dish: IDishesCommunication = {
    name: dishCom.name,
    uid: -1, // actual id will be retrieved in createDish method
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
    userID: userID,
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
    uid: oldDish.uid as number,
    description: dish.description ?
      dish.description : oldDish.description as string,
    price: dish.price ? dish.price : oldDish.price as number,
    products: dish.products ? dish.products : oldDish.products as [string],
    pictures: dish.pictures ? dish.pictures : oldDish.pictures as [string],
    picturesId: dish.picturesId
      ? dish.picturesId as [number] : oldDish.picturesId as [number],
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
