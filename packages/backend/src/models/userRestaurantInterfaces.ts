import mongoose from 'mongoose';

//Database structure for users in resto
export const userRestoSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  email: String,
  password: String,
  permissions: [String],
  subscribeTime: Date,
  isActive: Boolean,
  restaurantIDs: [Number],
  restaurantChains: [
    {uid: Number, name: String}
  ],
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
  subscriptionID: String,
  twoFactor: String,
});
