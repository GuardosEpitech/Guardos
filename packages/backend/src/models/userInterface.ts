import mongoose from 'mongoose';

//Database structure for users
export const userSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  email: String,
  password: String,
  permissions: [String],
  subscribeTime: Date,
  city: String,
  allergens: [String],
  dislikedIngredients: [String],
  // ISearchCommunication
  savedFilter: [{
    filterName: String,
    range: Number,
    rating: [Number],
    name: String,
    location: String,
    categories: [String],
    allergenList: [String],
  }],
  favouriteLists: {
    restoIDs: [Number],
    dishIDs: [{
      _id: false,
      restoID: Number,
      dishID: Number
    }]
  },
  profilePicId: {
    type: Number,
    required: false
  },
  preferredLanguage: String,
  preferencesCookie: {
    isSet: Boolean,
    functional: Boolean,
    statistical: Boolean,
    marketing: Boolean
  },
  customerID: String,
  subscriptionID: String,
  activeSubscriptionIdentifier: String,
});
