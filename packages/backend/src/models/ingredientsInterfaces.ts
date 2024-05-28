import mongoose from 'mongoose';

export const ingredientsSchemaMVP = new mongoose.Schema({
  _id: Number,
  name: String,
  allergens: [String],
});

export const nutrientsSchema = new mongoose.Schema({
  ENERC_KCAL: Number, // Calories
  PROCNT: Number, // Protein
  FAT: Number, // Fat
  CHOCDF: Number, // Carbs
  FIBTG: Number // Fiber
});

export const ingredientsSchema = new mongoose.Schema({
  _id: Number,
  foodID: String,
  name: String,
  nutrients: nutrientsSchema,
  healthLabels: [String],
  allergens: [String]
});
