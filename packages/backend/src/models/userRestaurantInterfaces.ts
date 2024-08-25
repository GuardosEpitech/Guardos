import mongoose from 'mongoose';

//Database structure for users in resto
export const userRestoSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  email: String,
  password: String,
  permissions: [String],
  isActive: Boolean,
  restaurantIDs: [Number],
  profilePicId: {
    type: [Number],
    required: false
  },
  defaultMenuDesign: String,
  preferredLanguage: String,
  preferencesCookie: {
    isSet: Boolean,
    functional: Boolean,
    statistical: Boolean,
    marketing: Boolean
  },
  customerID: String,
  twoFactor: String,
});
