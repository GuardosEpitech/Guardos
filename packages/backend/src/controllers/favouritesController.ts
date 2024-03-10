import mongoose from 'mongoose';
import {userSchema} from '../models/userInterface';
import {getRestaurantByID} from './restaurantController';
import {getDishByID} from './dishesController';


export async function getRestoFavourites(userID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOne({ uid: userID });
    if (!userData) {
      console.error('User not found');
      return null;
    }

    const restoIDs = userData.favouriteLists.restoIDs;
    const favouriteRestaurants = await Promise.all(restoIDs.map((restoID) =>
      getRestaurantByID(restoID)));

    return favouriteRestaurants;
  } catch (error) {
    console.error('Error getting favourite restaurants:', error);
    throw error;
  }
}

export async function getDishFavourites(userID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOne({ uid: userID });
    if (!userData) {
      console.error('User not found');
      return null;
    }

    const dishIDs = userData.favouriteLists.dishIDs;
    const favouriteDishes = await Promise.all(dishIDs.map((dish) =>
      getDishByID(dish.restoID, dish.dishID)));

    return favouriteDishes;
  } catch (error) {
    console.error('Error getting favourite dishes:', error);
    throw error;
  }
}

export async function addRestoAsFavourite(userID: number, restoID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOneAndUpdate(
      { uid: userID },
      { $addToSet: { 'favouriteLists.restoIDs': restoID } },
      { new: true }
    );

    if (!userData) {
      // Handle case where user with given ID is not found
      console.error('User not found');
      return null;
    }
    return userData;
  } catch (error) {
    console.error('Error adding resto as favourite list:', error);
    throw error;
  }
}

export async function addDishAsFavourite(userID: number, restoID: number,
  dishID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOneAndUpdate(
      { uid: userID },
      {
        $addToSet: {
          'favouriteLists.dishIDs': {
            restoID: restoID,
            dishID: dishID
          }
        }
      },
      { new: true }
    );

    if (!userData) {
      console.error('User not found');
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error adding dish as favourite list:', error);
    throw error;
  }
}

export async function deleteRestoFromFavourites(userID: number,
  restoID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOneAndUpdate(
      { uid: userID },
      { $pull: { 'favouriteLists.restoIDs': restoID } },
      { new: true }
    );

    if (!userData) {
      console.error('Restaurant not found');
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error deleting resto from favourites:', error);
    throw error;
  }
}

export async function deleteDishFromFavourites(userID: number, restoID: number, dishID: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  try {
    const userData = await UserSchema.findOneAndUpdate(
      { uid: userID },
      { $pull: {
        'favouriteLists.dishIDs': {
          restoID: restoID,
          dishID: dishID
        }
      } },
      { new: true }
    );

    if (!userData) {
      console.error('Dish not found');
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error deleting dish from favourites:', error);
    throw error;
  }
}
