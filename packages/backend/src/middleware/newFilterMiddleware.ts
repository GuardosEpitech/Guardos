import { 
    IRestaurantBackEnd, 
    IRestaurantFrontEnd 
} from "../../../shared/models/restaurantInterfaces";
import { ISearchCommunication } from "../models/communicationInterfaces";
import { IDishFE, IDishBE } from "../../../shared/models/dishInterfaces";
import { ICategories } from "../../../shared/models/categoryInterfaces";
import {restaurantSchema} from '../models/restaurantInterfaces';
import mongoose from 'mongoose';
import { ILocation } from "../models/locationInterfaces";
import { IMealType } from "../../../shared/models/mealTypeInterfaces";
import { IOpeningHours } from "../../../shared/models/restaurantInterfaces";
import { IProduct } from "../../../shared/models/restaurantInterfaces";
import { createBackEndObj } from "../controllers/restaurantController";
// import { geocodeAddress } from "../controllers/mapController";

async function retrieveAllRestaurantsAsBE() {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find();
  const answer: [IRestaurantBackEnd] = [{} as IRestaurantBackEnd];
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
          menuDesignID: restaurant.menuDesignID as number
        });
        answer.push(restaurantBE);
      }
      return answer;
}

export const haversineDistance = (
    userCoords: { lat: number; lng: number },
    objectCoords: { lat: number; lng: number }
  ): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
  
    const R = 6371;
  
    const dLat = toRad(objectCoords.lat - userCoords.lat);
    const dLng = toRad(objectCoords.lng - userCoords.lng);
  
    const lat1 = toRad(userCoords.lat);
    const lat2 = toRad(objectCoords.lat);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  };

export async function newfilterRestaurants
(searchParams: ISearchCommunication): Promise<IRestaurantFrontEnd[]> {
    const restoData: IRestaurantBackEnd[] = await retrieveAllRestaurantsAsBE();

    let filteredRestaurants: IRestaurantBackEnd[] = restoData;

    if (searchParams.name) {
        const searchName = searchParams.name.toLowerCase();
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const restaurantName = restaurant.name?.toLowerCase() || '';
            return restaurantName.includes(searchName);
        });
    }

    if (searchParams.range && searchParams.userLoc && searchParams.range > 0) {
        console.log("userPosition: ", searchParams.userLoc);
        // const geocode = await geocodeAddress(searchParams.userLoc);
        const userCoords = {
            lat: searchParams.userLoc.lat,
            lng: searchParams.userLoc.lng,
        };

        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const restaurantCoords = {
                lat: parseFloat(restaurant.location.latitude),
                lng: parseFloat(restaurant.location.longitude),
            };

            const distance = haversineDistance(userCoords, restaurantCoords);
            return distance <= searchParams.range;
        });
    }

    if (searchParams.rating && searchParams.rating.length === 2)
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const [minRating, maxRating] = searchParams.rating;
            return restaurant.rating >= minRating && restaurant.rating <= maxRating;
        });

    if (searchParams.location)
        filteredRestaurants = filteredRestaurants
            .filter(restaurant => restaurant.location?.city?.toLowerCase() 
            === searchParams.location?.toLowerCase());

    if (searchParams.categories && searchParams.categories.length > 0) {
        const categoriesLowerCase = searchParams.categories.map(category => category.toLowerCase());
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const restaurantCategories = restaurant.dishes?.map(dish => dish.category.foodGroup?.toLowerCase()) ?? [];
            return restaurantCategories.some(category => categoriesLowerCase.includes(category));
        });
    }
        
    if (searchParams.allergenList && searchParams.allergenList.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const totalDishes = restaurant.dishes?.length || 1;
            const dishesWithoutAllergen = restaurant.dishes?.filter(dish => 
                !dish.allergens?.some(allergen => searchParams.allergenList?.includes(allergen.toLowerCase()))) || [];
            const percentageWithoutAllergen = (dishesWithoutAllergen.length / totalDishes) * 100;
            return percentageWithoutAllergen >= 50;
        });
    }
    
    const result: IRestaurantFrontEnd[] = 
        transformToIRestaurantFrontend(filteredRestaurants);

    return result;
}

function createRestaurantObjFe(restaurant: IRestaurantBackEnd): IRestaurantFrontEnd {
    const obj: IRestaurantFrontEnd = {
        name: restaurant.name,
        website: restaurant.website,
        userID: restaurant.userID,
        restoChainID: restaurant.restoChainID,
        description: restaurant.description,
        rating: restaurant.rating,
        ratingCount: restaurant.ratingCount,
        pictures: restaurant.pictures,
        picturesId: restaurant.picturesId,
        openingHours: restaurant.openingHours,
        products: restaurant.products,
        uid: restaurant.uid,
        phoneNumber: restaurant.phoneNumber,
        categories: [],
        location: restaurant.location,
        range: 0,
        dishes: [],
        menuDesignID: restaurant.menuDesignID
    };
    const menuGroupToMealTypeIdMap: Map<string, number> = new Map();
    for (const dish of restaurant.dishes) {
        let mealTypeId = 0;
        if (dish.category.menuGroup && menuGroupToMealTypeIdMap.has(dish.category.menuGroup)) {
            mealTypeId = menuGroupToMealTypeIdMap.get(dish.category.menuGroup)!;
        } else {
            mealTypeId = menuGroupToMealTypeIdMap.size + 1;
            menuGroupToMealTypeIdMap.set(dish.category.menuGroup, mealTypeId);
            const newMealType: IMealType = {
                name: dish.category.menuGroup,
                id: mealTypeId,
                sortId: mealTypeId 
            };
            restaurant.mealType.push(newMealType);
        }
    }

    for (const mealType of restaurant.mealType) {
        const category: ICategories = {
            name: mealType.name,
            hitRate: 100,
            dishes: []
        };
        for (const dish of restaurant.dishes) {
            if (dish.category.menuGroup === mealType.name) {
                const dishObj: IDishFE = {
                    uid: dish.uid,
                    name: dish.name,
                    description: dish.description,
                    price: dish.price,
                    pictures: dish.pictures,
                    picturesId: dish.picturesId,
                    allergens: dish.allergens,
                    category: dish.category,
                    resto: restaurant.name,
                    products: dish.products,
                    discount: dish.discount,
                    validTill: dish.validTill,
                    combo: dish.combo
                };
                obj.dishes.push(dishObj);
                category.dishes.push(dishObj);
            }
        }
        obj.categories.push(category);
    }
    
    return obj;
}

function transformToIRestaurantFrontend(data: IRestaurantBackEnd[]): IRestaurantFrontEnd[] {
    const results: IRestaurantFrontEnd[] = data.map(restaurant => createRestaurantObjFe(restaurant));
    return results;
}
