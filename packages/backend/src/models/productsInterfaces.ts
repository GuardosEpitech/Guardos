import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  allergens: [String],
  ingredients: [String],
  restaurantId: [Number]
});
