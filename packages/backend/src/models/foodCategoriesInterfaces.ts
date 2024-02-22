import mongoose from 'mongoose';

export const foodCategoriesSchema = new mongoose.Schema({
  _id: Number,
  restaurantID: Number,
  name: String
});

export interface IFoodCategorieBE {
  id: number;
  restaurantID: number;
  name: string;
}