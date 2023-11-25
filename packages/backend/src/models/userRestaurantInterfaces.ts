import mongoose from 'mongoose';
import { restaurantSchema } from './restaurantInterfaces';

//Database structure for users in resto
export const userRestoSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isActive: Boolean,
  restaurants: [restaurantSchema],
});