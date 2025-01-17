import mongoose from 'mongoose';

import {
  IOpeningHours,
  IProduct,
  IRestaurantBackEnd,
  IRestaurantFrontEnd,
  IReview,
} from '../../../shared/models/restaurantInterfaces';
import { restaurantSchema } from '../models/restaurantInterfaces';
import { userRestoSchema } from '../models/userRestaurantInterfaces';
import { ICategories } from '../../../shared/models/categoryInterfaces';
import { IDishBE, IDishFE } from '../../../shared/models/dishInterfaces';
import { IMealType } from '../../../shared/models/mealTypeInterfaces';
import { ILocation } from '../../../shared/models/locationInterfaces';
import {
  IProfileCommunication,
  IRestaurantCommunication,
  ISearchCommunication
} from '../models/communicationInterfaces';
import { v4 as uuidv4 } from 'uuid';
import { geocodeAddress } from './mapController';

export function createBackEndObj(restaurant: IRestaurantBackEnd) {
  const restaurantBE: IRestaurantBackEnd = {
    name: restaurant.name,
    description: restaurant.description,
    uid: restaurant.uid,
    userID: restaurant.userID,
    restoChainID: restaurant.restoChainID,
    website: restaurant.website,
    rating: restaurant.rating,
    ratingCount: restaurant.ratingCount,
    phoneNumber: restaurant.phoneNumber,
    pictures: restaurant.pictures,
    picturesId: restaurant.picturesId,
    openingHours: [{} as IOpeningHours],
    products: [{} as IProduct],
    dishes: [{} as IDishBE],
    location: {} as ILocation,
    mealType: [{} as IMealType],
    extras: [{} as IDishBE],
    menuDesignID: restaurant.menuDesignID,
  };
  restaurantBE.dishes.pop();
  restaurantBE.mealType.pop();
  restaurantBE.extras.pop();
  restaurantBE.products.pop();
  restaurantBE.openingHours.pop();

  for (const dish of restaurant.dishes) {
    const dishObj: IDishBE = {
      uid: dish.uid,
      name: dish.name,
      description: dish.description,
      products: dish.products,
      pictures: dish.pictures,
      picturesId: dish.picturesId,
      price: dish.price,
      allergens: dish.allergens,
      category: dish.category,
      restoChainID: dish.restoChainID,
      discount: dish.discount,
      validTill: dish.validTill,
      combo: dish.combo,
    };
    restaurantBE.dishes.push(dishObj);
  }
  for (const openingHoursElement of restaurant.openingHours) {
    restaurantBE.openingHours.push(openingHoursElement);
  }
  for (const mealTypeElement of restaurant.mealType) {
    restaurantBE.mealType.push(mealTypeElement);
  }
  for (const product of restaurant.products) {
    restaurantBE.products.push(product);
  }
  restaurantBE.location = restaurant.location;
  for (const extra of restaurant.extras) {
    const extraObj: IDishBE = {
      uid: extra.uid,
      name: extra.name,
      description: extra.description,
      products: extra.products,
      price: extra.price,
      pictures: extra.pictures,
      picturesId: extra.picturesId,
      allergens: extra.allergens,
      category: extra.category,
      restoChainID: extra.restoChainID,
      discount: extra.discount,
      validTill: extra.validTill,
      combo: extra.combo,
    };
    restaurantBE.extras.push(extraObj);
  }
  return restaurantBE;
}

function createRestaurantObjFe(restaurant: IRestaurantBackEnd) {
  const obj: IRestaurantFrontEnd = {
    name: restaurant.name,
    uid: restaurant.uid,
    userID: restaurant.userID,
    website: restaurant.website,
    restoChainID: restaurant.restoChainID,
    description: restaurant.description,
    rating: restaurant.rating,
    ratingCount: restaurant.ratingCount,
    pictures: restaurant.pictures,
    picturesId: restaurant.picturesId,
    openingHours: [{} as IOpeningHours],
    products: [{} as IProduct],
    phoneNumber: restaurant.phoneNumber,
    categories: [{} as ICategories],
    dishes: [{} as IDishFE],
    location: restaurant.location,
    range: 0,
    menuDesignID: restaurant.menuDesignID,
  };
  obj.categories.pop();
  obj.products.pop();
  obj.openingHours.pop();
  obj.dishes.pop();

  for (const product of restaurant.products) {
    obj.products.push(product);
  }

  for (const openingHoursElement of restaurant.openingHours) {
    obj.openingHours.push(openingHoursElement);
  }

  for (const x of restaurant.mealType) {
    const categories: ICategories = {
      name: x.name,
      hitRate: x.sortId,
      dishes: [{} as IDishFE],
    };
    categories.dishes.pop();
    for (const dish of restaurant.dishes) {
      // fix to get all dishes ?!? !?!??!?!??!!?! investigate later TODO: !!!
      if (dish.category.menuGroup === x.name) {
        const dishObj: IDishFE = {
          name: dish.name,
          uid: dish.uid,
          description: dish.description,
          price: dish.price,
          pictures: dish.pictures,
          picturesId: dish.picturesId,
          allergens: dish.allergens,
          category: {
            foodGroup: dish.category.foodGroup,
            extraGroup: dish.category.extraGroup,
            menuGroup: dish.category.menuGroup,
          },
          resto: restaurant.name,
          restoChainID: dish.restoChainID,
          products: dish.products,
          discount: dish.discount,
          validTill: dish.validTill,
          combo: dish.combo,
        };
        categories.dishes.push(dishObj);
        obj.dishes.push(dishObj);
      }
    }
    obj.categories.push(categories);
  }

  return obj;
}

export async function getRestaurantByName(restaurantName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const rest = await Restaurant.findOne({ name: restaurantName });
  if (!rest) return null;

  const restaurantBE = createBackEndObj({
    description: rest.description as string,
    dishes: rest.dishes as [IDishBE],
    extras: rest.extras as unknown as [IDishBE],
    uid: rest._id as number,
    userID: rest.userID as number,
    restoChainID: rest.restoChainID as number,
    location: rest.location as ILocation,
    mealType: rest.mealType as [IMealType],
    name: rest.name as string,
    openingHours: rest.openingHours as [IOpeningHours],
    phoneNumber: rest.phoneNumber as string,
    pictures: rest.pictures as [string],
    picturesId: rest.picturesId as [number],
    products: rest.products as [IProduct],
    rating: rest.rating as number,
    ratingCount: rest.ratingCount as number,
    website: rest.website as string,
    menuDesignID: rest.menuDesignID as number,
  });
  return createRestaurantObjFe(restaurantBE);
}

export async function getUserRestaurantByName(restaurantName: string, userId: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const rest = await Restaurant.findOne({ name: restaurantName, userID: userId });
  if (!rest) return null;

  const restaurantBE = createBackEndObj({
    description: rest.description as string,
    dishes: rest.dishes as [IDishBE],
    extras: rest.extras as unknown as [IDishBE],
    uid: rest._id as number,
    userID: rest.userID as number,
    restoChainID: rest.restoChainID as number,
    location: rest.location as ILocation,
    mealType: rest.mealType as [IMealType],
    name: rest.name as string,
    openingHours: rest.openingHours as [IOpeningHours],
    phoneNumber: rest.phoneNumber as string,
    pictures: rest.pictures as [string],
    picturesId: rest.picturesId as [number],
    products: rest.products as [IProduct],
    rating: rest.rating as number,
    ratingCount: rest.ratingCount as number,
    website: rest.website as string,
    menuDesignID: rest.menuDesignID as number,
  });
  return createRestaurantObjFe(restaurantBE);
}

export async function getRestaurantByID(restaurantID: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const rest = await Restaurant.findOne({ _id: restaurantID });
  if (!rest) return null;

  const restaurantBE = createBackEndObj({
    description: rest.description as string,
    dishes: rest.dishes as [IDishBE],
    extras: rest.extras as unknown as [IDishBE],
    uid: rest._id as number,
    userID: rest.userID as number,
    restoChainID: rest.restoChainID as number,
    location: rest.location as ILocation,
    mealType: rest.mealType as [IMealType],
    name: rest.name as string,
    openingHours: rest.openingHours as [IOpeningHours],
    phoneNumber: rest.phoneNumber as string,
    pictures: rest.pictures as [string],
    picturesId: rest.picturesId as [number],
    products: rest.products as [IProduct],
    rating: rest.rating as number,
    ratingCount: rest.ratingCount as number,
    website: rest.website as string,
    menuDesignID: rest.menuDesignID as number,
  });
  return createRestaurantObjFe(restaurantBE);
}

export async function getAllRestaurants() {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find();
  const answer: [IRestaurantFrontEnd] = [{} as IRestaurantFrontEnd];
  answer.pop();

  for (const restaurant of await restaurants) {
    const restaurantBE = createBackEndObj({
      description: restaurant.description as string,
      dishes: restaurant.dishes as [IDishBE],
      extras: restaurant.extras as unknown as [IDishBE],
      userID: restaurant.userID as number,
      restoChainID: restaurant.restoChainID as number,
      uid: restaurant._id as number,
      location: restaurant.location as ILocation,
      mealType: restaurant.mealType as [IMealType],
      name: restaurant.name as string,
      openingHours: restaurant.openingHours as [IOpeningHours],
      phoneNumber: restaurant.phoneNumber as string,
      pictures: restaurant.pictures as [string],
      picturesId: restaurant.picturesId as [number],
      products: restaurant.products as [IProduct],
      rating: restaurant.rating as number,
      ratingCount: restaurant.ratingCount as number,
      website: restaurant.website as string,
      menuDesignID: restaurant.menuDesignID as number,
    });
    answer.push(createRestaurantObjFe(restaurantBE));
  }
  return answer;
}

export async function getAllUserRestaurants(loggedInUserId: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find({ userID: loggedInUserId });
  const answer: [IRestaurantFrontEnd] = [{} as IRestaurantFrontEnd];
  answer.pop();

  for (const restaurant of await restaurants) {
    const restaurantBE = createBackEndObj({
      description: restaurant.description as string,
      dishes: restaurant.dishes as [IDishBE],
      extras: restaurant.extras as unknown as [IDishBE],
      userID: restaurant.userID as number,
      restoChainID: restaurant.restoChainID as number,
      uid: restaurant._id as number,
      location: restaurant.location as ILocation,
      mealType: restaurant.mealType as [IMealType],
      name: restaurant.name as string,
      openingHours: restaurant.openingHours as [IOpeningHours],
      phoneNumber: restaurant.phoneNumber as string,
      pictures: restaurant.pictures as [string],
      picturesId: restaurant.picturesId as [number],
      products: restaurant.products as [IProduct],
      rating: restaurant.rating as number,
      ratingCount: restaurant.ratingCount as number,
      website: restaurant.website as string,
      menuDesignID: restaurant.menuDesignID as number,
    });
    answer.push(createRestaurantObjFe(restaurantBE));
  }
  return answer;
}

export async function getAllUserRestaurantChains(loggedInUserId: number) {
  const UserRestoSchema = mongoose.model(
    'UserResto',
    userRestoSchema,
    'UserResto'
  );
  const userData = await UserRestoSchema.findOne({ uid: loggedInUserId });

  return userData.restaurantChains;
}

export async function getAllRestosFromRestoChain(
  loggedInUserId: number,
  restaurantChainID: number
) {
  const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
  const query: any = {
    userID: loggedInUserId,
    restoChainID: restaurantChainID,
  };

  const restaurants = await RestaurantModel.find(query);
  const answer: IRestaurantFrontEnd[] = [];

  for (const restaurant of restaurants) {
    const restaurantBE = createBackEndObj({
      description: restaurant.description as string,
      dishes: restaurant.dishes as [IDishBE],
      extras: restaurant.extras as unknown as [IDishBE],
      userID: restaurant.userID as number,
      restoChainID: restaurant.restoChainID as number,
      uid: restaurant._id as number,
      location: restaurant.location as ILocation,
      mealType: restaurant.mealType as [IMealType],
      name: restaurant.name as string,
      openingHours: restaurant.openingHours as [IOpeningHours],
      phoneNumber: restaurant.phoneNumber as string,
      pictures: restaurant.pictures as [string],
      picturesId: restaurant.picturesId as [number],
      products: restaurant.products as [IProduct],
      rating: restaurant.rating as number,
      ratingCount: restaurant.ratingCount as number,
      website: restaurant.website as string,
      menuDesignID: restaurant.menuDesignID as number,
    });
    answer.push(createRestaurantObjFe(restaurantBE));
  }

  return answer;
}

export async function deleteRestoChainFromRestaurant(
  loggedInUserId: number,
  restoChainID: number
) {
  const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);

  // Use await to handle the asynchronous operation
  try {
    const result = await RestaurantModel.updateMany(
      { userID: loggedInUserId, restoChainID: restoChainID },
      { $unset: { restoChainID: 1 } }
    );
    return result;
  } catch (error) {
    console.error('Error updating records:', error);
    return false;
  }
}

export async function getAllUserRestaurantsFiltered(
  loggedInUserId: number,
  locationOrName?: string
): Promise<IRestaurantFrontEnd[]> {
  const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
  const query: any = { userID: loggedInUserId };

  if (locationOrName) {
    query.$or = [
      { name: { $regex: new RegExp(locationOrName, 'i') } },
      { 'location.streetName': { $regex: new RegExp(locationOrName, 'i') } },
      { 'location.city': { $regex: new RegExp(locationOrName, 'i') } },
      { 'location.postalCode': { $regex: new RegExp(locationOrName, 'i') } },
    ];
  }

  const restaurants = await RestaurantModel.find(query);
  const answer: IRestaurantFrontEnd[] = [];

  for (const restaurant of restaurants) {
    const restaurantBE = createBackEndObj({
      description: restaurant.description as string,
      dishes: restaurant.dishes as [IDishBE],
      extras: restaurant.extras as unknown as [IDishBE],
      userID: restaurant.userID as number,
      restoChainID: restaurant.restoChainID as number,
      uid: restaurant._id as number,
      location: restaurant.location as ILocation,
      mealType: restaurant.mealType as [IMealType],
      name: restaurant.name as string,
      openingHours: restaurant.openingHours as [IOpeningHours],
      phoneNumber: restaurant.phoneNumber as string,
      pictures: restaurant.pictures as [string],
      picturesId: restaurant.picturesId as [number],
      products: restaurant.products as [IProduct],
      rating: restaurant.rating as number,
      ratingCount: restaurant.ratingCount as number,
      website: restaurant.website as string,
      menuDesignID: restaurant.menuDesignID as number,
    });
    answer.push(createRestaurantObjFe(restaurantBE));
  }

  return answer;
}

function formatLocation(location: ILocation): string {
  const formattedAddress = `${location.streetName} ${location.streetNumber}, 
  ${location.postalCode} ${location.city}, ${location.country}`;
  return formattedAddress;
}

export async function createNewRestaurant(
  obj: IRestaurantCommunication,
  userID: number,
  id: number
) {
  const RestaurantSchema = mongoose.model('Restaurants', restaurantSchema);
  const loc = obj.location;
  const address = formatLocation(obj.location);
  const coordinates = await geocodeAddress(address);
  if (coordinates) {
    loc.latitude = coordinates.lat;
    loc.longitude = coordinates.lng;
  }
  const upload = new RestaurantSchema({
    _id: id,
    name: obj.name,
    userID: userID,
    phoneNumber: obj.phoneNumber ? obj.phoneNumber : '',
    website: obj.website ? obj.website : '',
    rating: 0,
    ratingCount: 0,
    description: obj.description ? obj.description : '',
    dishes: obj.dishes ? obj.dishes : [],
    pictures: obj.pictures ? obj.pictures : [''],
    picturesId: obj.picturesId ? obj.picturesId : [],
    openingHours: obj.openingHours
      ? obj.openingHours
      : [{ open: '11:00', close: '22:00', day: 0 }],
    location: obj.location ? loc : {},
    mealType: obj.mealType ? obj.mealType : [],
    products: obj.products ? obj.products : [],
    extras: obj.extras ? obj.extras : [],
    menuDesignID: obj.menuDesignID ? obj.menuDesignID : 0,
    ...(obj.restoChainID !== null && { restoChainID: obj.restoChainID })
  });
  await upload.save();
  return upload;
}


export async function deleteRestaurantByID(restaurantID: number) {
  const Restaurant = mongoose.model('Restaurants', restaurantSchema);
  await Restaurant.deleteOne({ _id: restaurantID });
  return 'deleted ' + restaurantID;
}

async function updateRestaurantById(
  restaurant: IRestaurantBackEnd,
  restaurantId: number
) {
  const Restaurant = mongoose.model('Restaurants', restaurantSchema);
  return Restaurant.findOneAndUpdate({ _id: restaurantId }, restaurant, {
    new: true,
  });
}

export async function changeRestaurantByID(
  restaurant: IRestaurantCommunication,
  restaurantId: number
) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const oldRest = (await Restaurant.findOne({
    _id: restaurantId,
  })) as IRestaurantBackEnd;
  const loc = restaurant.location;
  const address = formatLocation(restaurant.location);
  const coordinates = await geocodeAddress(address);
  loc.latitude = coordinates.lat;
  loc.longitude = coordinates.lng;
  const newRest: IRestaurantBackEnd = {
    description: restaurant.description
      ? restaurant.description
      : oldRest.description,
    dishes: restaurant.dishes ? restaurant.dishes : oldRest.dishes,
    extras: restaurant.extras ? restaurant.extras : oldRest.extras,
    uid: oldRest.uid,
    userID: oldRest.userID,
    restoChainID:
        restaurant.restoChainID !== undefined
          ? restaurant.restoChainID
          : oldRest.restoChainID,
    location: restaurant.location ? loc : oldRest.location,
    mealType: restaurant.mealType ? restaurant.mealType : oldRest.mealType,
    openingHours: restaurant.openingHours
      ? restaurant.openingHours
      : oldRest.openingHours,
    phoneNumber: restaurant.phoneNumber
      ? restaurant.phoneNumber
      : oldRest.phoneNumber,
    pictures: restaurant.pictures ? restaurant.pictures : oldRest.pictures,
    picturesId: restaurant.picturesId
      ? restaurant.picturesId
      : oldRest.picturesId,
    products: restaurant.products ? restaurant.products : oldRest.products,
    rating: oldRest.rating,
    ratingCount: oldRest.ratingCount,
    website: restaurant.website ? restaurant.website : oldRest.website,
    name: restaurant.name ? restaurant.name : oldRest.name,
    menuDesignID:
        restaurant.menuDesignID !== undefined
          ? restaurant.menuDesignID
          : oldRest.menuDesignID,
  };
  await updateRestaurantById(newRest, restaurantId);
  return newRest;
}

export async function addRestoProduct(product: IProduct, restoName: string, userID: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restoName, userID: userID },
    { $push: { products: product } },
    { new: true }
  );
}

export async function getAllRestoProducts(restoName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const rest = await Restaurant.findOne({ name: restoName });
  if (!rest) return null;
  return rest.products;
}

export async function getAllRestoReviews(restoName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const rest = await Restaurant.findOne({ name: restoName });
  if (!rest) return null;
  return rest.reviews;
}

export async function addRestoReview(review: IReview, restoName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  review.date = new Date();
  review._id = uuidv4();
  const updatedRestaurant = await Restaurant.findOneAndUpdate(
    { name: restoName },
    { $push: { reviews: review } },
    { new: true } 
  );

  if (!updatedRestaurant) {
    throw new Error(`Restaurant with name "${restoName}" not found.`);
  }

  const reviews = updatedRestaurant.reviews as IReview[];
  const totalRating = reviews.reduce(
    (sum, rev) => sum + (rev.note ? +rev.note : 0), 
    0
  );
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  updatedRestaurant.rating = averageRating;
  updatedRestaurant.ratingCount = reviews.length;
  await updatedRestaurant.save();

  return updatedRestaurant;
}

export async function getReviewByUserName(userName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find({});

  const reviews: IReview[] = [];

  for (const rest of restaurants) {
    const userReviews = rest.reviews
      .filter((review: any) => review.userName === userName)
      .map((review: any) => ({
        _id: String(review._id),
        date: new Date(review.date),
        note: Number(review.note),
        comment: String(review.comment),
        restoName: String(rest.name),
        userName: String(review.userName),
      }));
    reviews.push(...userReviews);
  }

  return reviews;
}

export async function deleteRestoReview(reviewId: string, restoName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);

  const updatedRestaurant = await Restaurant.findOneAndUpdate(
    { name: restoName },
    { $pull: { reviews: { _id: reviewId } } },
    { new: true }
  );

  if (!updatedRestaurant) {
    throw new Error(`Restaurant with name "${restoName}" not found.`);
  }

  const reviews = updatedRestaurant.reviews as IReview[];
  const totalRating = reviews.reduce(
    (sum, rev) => sum + (rev.note ? +rev.note : 0),
    0
  );
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  updatedRestaurant.rating = averageRating;
  updatedRestaurant.ratingCount = reviews.length;

  await updatedRestaurant.save();

  return updatedRestaurant;
}

export async function modifyRestoReview(
  reviewId: string,
  modifiedFields: Partial<IReview>,
  restoName: string
) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);

  if (!modifiedFields || Object.keys(modifiedFields).length === 0) {
    return Restaurant.findOne({ name: restoName });
  }

  const updateQuery: Record<string, any> = {};
  for (const key in modifiedFields) {
    if (Object.prototype.hasOwnProperty.call(modifiedFields, key)) {
      updateQuery[`reviews.$.${key}`] = modifiedFields[key as keyof IReview];
    }
  }

  const updatedRestaurant = await Restaurant.findOneAndUpdate(
    { name: restoName, 'reviews._id': reviewId },
    { $set: updateQuery },
    { new: true }
  );

  if (!updatedRestaurant) {
    throw new Error(`Restaurant with name "${restoName}" not found.`);
  }

  const reviews = updatedRestaurant.reviews as IReview[];
  const totalRating = reviews.reduce(
    (sum, rev) => sum + (rev.note ? +rev.note : 0),
    0
  );
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  updatedRestaurant.rating = averageRating;
  await updatedRestaurant.save();

  return updatedRestaurant;
}

export async function addCategory(
  uid: number,
  newCategories: [{ name: string; hitRate: number, edited?: boolean }]
) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);

  try {
    const rest = await Restaurant.findOne({ _id: uid });

    if (!rest) {
      throw new Error('Restaurant not found');
    }
    const transformedArray= newCategories.map((category, index) => ({
      _id: index + 1,
      name: category.name,
      sortId: category.hitRate
    }));
    rest.mealType = transformedArray;

    rest.dishes.forEach(dish => {
      const dishCategory = dish.category;
    
      const editedCategory = newCategories.find(category => category.edited);
    
      if (editedCategory) {
        const categoryInNewCategories = newCategories.some(category => 
          category.name === dishCategory.menuGroup && 
          category.name === dishCategory.foodGroup
        );

        if (!categoryInNewCategories) {
          dish.category.menuGroup = editedCategory.name;
          dish.category.foodGroup = editedCategory.name;
        }
      }
    });

    await rest.save();

    const restaurantBE = createBackEndObj({
      description: rest.description as string,
      dishes: rest.dishes as [IDishBE],
      extras: rest.extras as unknown as [IDishBE],
      uid: rest._id as number,
      userID: rest.userID as number,
      restoChainID: rest.restoChainID as number,
      location: rest.location as ILocation,
      mealType: rest.mealType as [IMealType],
      name: rest.name as string,
      openingHours: rest.openingHours as [IOpeningHours],
      phoneNumber: rest.phoneNumber as string,
      pictures: rest.pictures as [string],
      picturesId: rest.picturesId as [number],
      products: rest.products as [IProduct],
      rating: rest.rating as number,
      ratingCount: rest.ratingCount as number,
      website: rest.website as string,
      menuDesignID: rest.menuDesignID as number,
    });

    console.log('restaurantBE dishes: ', restaurantBE.dishes);

    return createRestaurantObjFe(restaurantBE);
  } catch (error) {
    console.error('Error adding/updating category:', error);
    throw error;
  }
}

export async function doesUserOwnRestaurantByName(
  restoName: string,
  userID: number
) {
  try {
    const restaurant = await getUserRestaurantByName(restoName, userID);
    if (!restaurant || restaurant.userID !== userID) {
      return null;
    }
    return restaurant;
  } catch (error) {
    console.error('Error finding restaurant for user:', error);
    throw error;
  }
}

export async function doesUserOwnRestaurantById(
  restoID: number,
  userID: number
) {
  try {
    const restaurant = await getRestaurantByID(restoID);
    if (!restaurant || restaurant.userID !== userID) {
      return null;
    }
    return restaurant;
  } catch (error) {
    console.error('Error finding restaurant for user:', error);
    throw error;
  }
}

export async function getProfileDetailsResto(userId: number) {
  const UserSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserSchema.findOne({uid: userId});
  const inter: IProfileCommunication = {
    username: userData.username === undefined ? ''
      : userData.username as string,
    email: userData.email === undefined ? ''
      : userData.email as string,
    city: '',
    allergens: [],
    dislikedIngredients: [],
    savedFilter: [] as unknown as [ISearchCommunication],
    profilePicId: userData.profilePicId === undefined ? 0
      : userData.profilePicId[0] as number,
    preferredLanguage: userData.preferredLanguage === undefined ? ''
      : userData.preferredLanguage as string
  };
  return inter;
}

export async function addCustomerResto(userID: number, customerID: string) {
  const UserSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const existingUser = await UserSchema.findOne({ uid: userID });

  if (existingUser && existingUser.customerID) {
    return existingUser.customerID;
  } else {
    const answer = await UserSchema.findOneAndUpdate(
      { uid: userID },
      { $set: { customerID: customerID } },
      { new: true }
    );
    return answer.customerID;
  }
}
