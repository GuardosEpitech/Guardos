import mongoose from 'mongoose';

import { ICategoryFE } from '../../../shared/models/categoryInterfaces';
import { IDishesCommunication } from '../models/communicationInterfaces';
import { IDishBE, IDishFE } from '../../../shared/models/dishInterfaces';
import { IMealType } from '../../../shared/models/mealTypeInterfaces';
import { IRestaurantBackEnd, IRestaurantFrontEnd }
  from '../../../shared/models/restaurantInterfaces';
import { restaurantSchema } from '../models/restaurantInterfaces';
import {getAllUserRestaurants, getRestaurantByID, getAllRestosFromRestoChain} from './restaurantController';

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
        restoChainID: dish.restoChainID,
        discount: dish.discount,
        validTill: dish.validTill,
        combo: dish.combo
      };
      dishFE.pictures.pop();
      dishFE.allergens.pop();
      dishFE.picturesId?.pop();

      dishFE.category = dish.category ? dish.category : {
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
        restoChainID: rest.restoChainID as number,
        discount: dish.discount as number,
        validTill: dish.validTill as string,
        combo: dish.combo as number[]
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
  }

  let highestDishId = 0;
  const dishes = restaurant?.dishes;
  if (dishes.length > 0) {
    highestDishId =
        Math.max(...dishes.map((dish) => dish.uid));
  }
  const newDishId = highestDishId + 1;
  dish.uid = newDishId;
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
    restoChainID: dishCom.restoChainID ?? -1,
    userID: userID,
    discount: -1,
    validTill: ''
  };
  await createDish(restaurantName, dish);
  return dish;
}

export async function createNewForEveryRestoChainDish(
  dishCom: IDishesCommunication, userID: number, 
  restoChainID: number, restaurantName: string) {
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
    restoChainID: restoChainID,
    userID: userID,
    discount: -1,
    validTill: ''
  };
  const restaurants = await getAllRestosFromRestoChain(userID, restoChainID);

  for (const elem of restaurants) {
    if (elem.name !== restaurantName) {
      await createDish(elem.name, dish);
    }
  }
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

export async function updateDishByID(
  restaurantID: number, dish: IDishBE) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { _id: restaurantID, 'dishes.uid': dish.uid },
    { $set: { 'dishes.$': dish } },
    { new: true }
  );
}

export async function changeDishByID(
  restaurantID: number, dish: IDishesCommunication, allergens: string[]) {
  const oldDish = await getDishByID(restaurantID, dish.uid);
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
    allergens: allergens ? allergens as [string] :
        oldDish.allergens as [string],
    category: dish.category ? dish.category : oldDish.category as {
        menuGroup: string;
        foodGroup: string;
        extraGroup: [string];
      },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: dish.discount,
    validTill: dish.validTill as string,
    combo: oldDish.combo as [number],
  };
  await updateDishByID(restaurantID, newDish);
  return newDish;
}

export async function changeDishByName(
  restaurantName: string, dish: IDishesCommunication, allergens: string[]) {
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
    allergens: allergens ? allergens as [string] :
      oldDish.allergens as [string],
    category: dish.category ? dish.category : oldDish.category as {
      menuGroup: string;
      foodGroup: string;
      extraGroup: [string];
    },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: dish.discount,
    validTill: dish.validTill as string,
    combo: oldDish.combo as [number]
  };
  await updateDish(restaurantName, newDish);
  return newDish;
}

export async function addDishDiscount(
  restoID: number, dish: IDishesCommunication) {
  const restaurant = await getRestaurantByID(restoID);
  const oldDish = await getDishByName(restaurant.name, dish.name);
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
    },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: dish.discount,
    validTill: dish.validTill as string,
    combo: oldDish.combo as [number]
  };
  await updateDish(restaurant.name, newDish);
  return newDish;
}

export async function removeDishDiscount(
  restoID: number, dish: IDishesCommunication ) {
  const restaurant = await getRestaurantByID(restoID);
  const oldDish = await getDishByName(restaurant.name, dish.name);
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
      },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: -1,
    validTill: '',
    combo: oldDish.combo as [number]
  };
  await updateDish(restaurant.name, newDish);
  return newDish;
}

export async function addDishCombo(
  resto: IRestaurantFrontEnd, dish: IDishesCommunication, combo: number[]) {
  const oldDish = await getDishByName(resto.name, dish.name);
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
      },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: oldDish.discount as number,
    validTill: oldDish.validTill as string,
    combo: combo
  };
  await updateDish(resto.name, newDish);
  return newDish;
}

export async function removeDishCombo(
  resto: IRestaurantFrontEnd, dish: IDishesCommunication) {
  const oldDish = await getDishByName(resto.name, dish.name);
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
      },
    restoChainID: dish.restoChainID ?? oldDish.restoChainID as number,
    discount: oldDish.discount as number,
    validTill: oldDish.validTill as string,
    combo: []
  };
  await updateDish(resto.name, newDish);
  return newDish;
}
