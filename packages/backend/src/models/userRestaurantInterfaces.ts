import mongoose from 'mongoose';

//Database structure for users in resto
export const userRestoSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  email: String,
  password: String,
  isActive: Boolean,
  restaurantIDs: [Number],
});