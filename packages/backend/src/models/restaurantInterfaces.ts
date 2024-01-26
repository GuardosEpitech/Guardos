import mongoose from 'mongoose';

//Database structure for restaurants
export const restaurantSchema = new mongoose.Schema({
  _id: Number,
  userID: Number,
  name: String,
  phoneNumber: String,
  rating: Number,
  ratingCount: Number,
  website: String,
  openingHours: [{
    open: String,
    close: String,
    day: Number,
  }],
  pictures: [String],
  picturesId: {
    type: [Number],
    required: false
  },
  description: String,
  dishes: [{
    _id: Number,
    name: String,
    description: String,
    products: [String],
    pictures: [String],
    picturesId: {
      type: [Number],
      required: false
    },
    price: Number,
    allergens: [String],
    category: {
      menuGroup: String,
      foodGroup: String,
      extraGroup: [String],
    },
  }],
  location: {
    streetName: String,
    streetNumber: String,
    postalCode: String,
    country: String,
    city: String,
  },
  mealType: [{
    _id: Number,
    name: String,
    sortId: Number,
  }],
  extras: [{
    _id: Number,
    name: String,
    description: String,
    price: Number,
    pictures: [String],
    picturesId: {
      type: [Number],
      required: false
    },
    allergens: [String],
    products: [String],
    category: {
      menuGroup: String,
      foodGroup: String,
      extraGroup: String,
    },
  }],
  products: [{
    name: String,
    allergens: [String],
    ingredients: [String],
  }],
});
