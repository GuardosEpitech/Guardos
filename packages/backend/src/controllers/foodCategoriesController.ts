import mongoose from 'mongoose';
import {foodCategoriesSchema} from '../models/foodCategoriesInterfaces';
import {IFoodCategorieBE} from '../models/foodCategoriesInterfaces';


export async function getNewFoodCategorieId() {
  const foodCategories = mongoose.model('FoodCategories', foodCategoriesSchema, 'FoodCategories');
  try {
    const foodCategorie = await foodCategories.find()
      .sort({ _id: -1 })
      .limit(1);

    if (foodCategorie.length === 0) {
      console.log('No food categories found.');
      return 0;
    }
    const newFoodCategorieId = foodCategorie[0]._id +1;

    console.log('New food categorie id is: ', newFoodCategorieId);
    return newFoodCategorieId;
  } catch (error) {
    console.error('Error occurred while getting new food categorie id: ', error);
    return null;
  }
}

export async function getFoodCategoriesBasedOnRestaurant(restaurantID: Number):Promise<any> {
  try {
    const foodCategorie = mongoose.model('FoodCategories', foodCategoriesSchema, 'FoodCategories');

    return await foodCategorie.find({restaurantID: restaurantID});
  } catch (error) {

    console.error('Error while searching for a food categorie ', error);
    return [];
  }
}

export async function deleteFoodCategorieByID(foodCategorieID: Number) {
  try {
    const foodCategorie = mongoose.model('FoodCategories', foodCategoriesSchema, 'FoodCategories');
    const existingProduct = await foodCategorie.findOne({ _id: foodCategorieID });

    if (!existingProduct) {
      console.log('food categorie not found');
      return false;
    }
    await foodCategorie.deleteOne({ _id: foodCategorieID });

    console.log('food categorie deleted successfully');
    return true;

  } catch (error) {
    console.error('Error while deleting the food categorie: ', error);

    return false;
  }
}

export async function updateFoodCategorie(foodCategorie: IFoodCategorieBE, foodCategorieID: Number) {
  const Product = mongoose.model('FoodCategories', foodCategoriesSchema, 'FoodCategories');
  return Product.findOneAndUpdate(
    { _id: foodCategorieID },
    foodCategorie,
    { new: true }
  );
}

export async function createFoodCategorie(restaurantId: number, newFoodCategorieName: string) {
  try {
    const foodCategories = mongoose.model('FoodCategories', foodCategoriesSchema, 'FoodCategories');
    const newFoodCategorieId = await getNewFoodCategorieId();

    if (newFoodCategorieId === null) {
      console.log('Error while getting new food categorie id');
      return;
    }
    const newFoodCategorie = new foodCategories({
      _id: newFoodCategorieId,
      restaurantID: restaurantId,
      name: newFoodCategorieName
    });
    await newFoodCategorie.save();

  } catch (error) {
    console.error('Error while creating a new food categorie: ', error);
  }
}
