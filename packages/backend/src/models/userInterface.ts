import mongoose from 'mongoose';

//Database structure for users
export const userSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  email: String,
  password: String,
  allergens: [String],
});
