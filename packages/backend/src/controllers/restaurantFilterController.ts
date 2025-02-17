import { ICategories } from '../../../shared/models/categoryInterfaces';
import { IDishBE, IDishFE } from '../../../shared/models/dishInterfaces';
import { ILocation } from '../../../shared/models/locationInterfaces';
import { IMealType } from '../../../shared/models/mealTypeInterfaces';
import { IOpeningHours, IProduct, IRestaurantBackEnd, IRestaurantFrontEnd }
  from '../../../shared/models/restaurantInterfaces';
import { readAndGetAllRestaurants } from './connectDataBase';

export default class Filter {
  restaurants: Promise<IRestaurantBackEnd[]>;

  constructor() {
    this.restaurants = this.getAllRestaurants();
  }

  // Create BE object from JSON
  private async getAllRestaurants() {
    const result: IRestaurantBackEnd[] = [];
    const data = await readAndGetAllRestaurants();
    for (const elem of data) {
      const obj = this.createBackEndObj({
        uid: elem._id as number,
        name: elem.name,
        userID: elem.userID,
        restoChainID: elem.restoChainID,
        description: elem.description,
        rating: elem.rating,
        ratingCount: elem.ratingCount,
        openingHours: elem.openingHours,
        pictures: elem.pictures,
        picturesId: elem.picturesId,
        products: elem.products,
        website: elem.website,
        phoneNumber: elem.phoneNumber,
        mealType: elem.mealType,
        dishes: elem.dishes,
        location: elem.location,
        extras: elem.extras,
        menuDesignID: elem.menuDesignID
      });
      result.push(obj);
    }
    //Sort mealType for frontend by sortId
    for (const elem of result) {
      elem.mealType.sort((a, b) =>
        (a.sortId > b.sortId) ? 1 : -1);
    }
    return result;
  }

  private createBackEndObj(restaurant: IRestaurantBackEnd) {

    const restaurantBE: IRestaurantBackEnd = {
      name: restaurant.name,
      userID: restaurant.userID,
      restoChainID: restaurant.restoChainID,
      description: restaurant.description,
      uid: restaurant.uid,
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
      menuDesignID: restaurant.menuDesignID
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
        combo: dish.combo
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
        allergens: extra.allergens,
        category: extra.category,
        discount: extra.discount,
        restoChainID: extra.restoChainID,
        validTill: extra.validTill,
        combo: extra.combo
      };
      restaurantBE.extras.push(extraObj);
    }
    return restaurantBE;
  }

  getRestaurants() {
    return this.restaurants;
  }

  // Create RestaurantObj for Frontend
  createRestaurantObjFe(restaurant: IRestaurantBackEnd, hitRate: number) {
    if (isNaN(hitRate)) hitRate = 0;
    const obj: IRestaurantFrontEnd = {
      name: restaurant.name,
      uid: restaurant.uid,
      website: restaurant.website,
      userID: restaurant.userID,
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
      location: restaurant.location,
      hitRate: hitRate,
      range: 0,
      dishes: [{} as IDishFE],
      menuDesignID: restaurant.menuDesignID
    };
    obj.categories.pop();
    obj.products.pop();
    obj.openingHours.pop();

    for (const product of restaurant.products) {
      obj.products.push(product);
    }
    for (const openingHoursElement of restaurant.openingHours) {
      obj.openingHours.push(openingHoursElement);
    }

    for (const x of restaurant.mealType) {
      const categories: ICategories = {
        name: x.name,
        hitRate: 0,
        dishes: [{} as IDishFE]
      };
      categories.dishes.pop();
      for (const dish of restaurant.dishes) {
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
              menuGroup: dish.category.menuGroup
            },
            resto: restaurant.name,
            restoChainID: dish.restoChainID,
            products: dish.products,
            discount: dish.discount,
            validTill: dish.validTill,
            combo: dish.combo
          };
          categories.dishes.push(dishObj);
        }
      }
      obj.categories.push(categories);
    }
    return obj;
  }

  // Filter for Allergens
  public async filterForRestaurantsWithAllergens(allergens: string[]) {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();

    for (const restaurant of await this.restaurants) {

      let count = 0;

      // Check if restaurant has any dishes with allergens to get hitRate
      for (const dish of restaurant.dishes) {
        count = this.countHitRateAllergens(dish.allergens, allergens, count);
      }

      // Create RestaurantObj for Frontend with hitRate
      const obj = this.createRestaurantObjFe(restaurant as IRestaurantBackEnd,
        (1 - (count / restaurant.dishes.length)) * 100);

      // Check if dishes contains allergens (in categories) to get hitRate
      for (const category of obj.categories) {
        for (const dish of category.dishes) {
          count = this.countHitRateAllergens(dish.allergens, allergens, count);
        }
        category.hitRate = (1 - (count / category.dishes.length)) * 100;
      }
      results.push(obj);

      // Sort results by hitRate
      results.sort((a, b) =>
        (a.hitRate < b.hitRate) ? 1 : -1);
      return results;
    }
  }

  // Count how often an allergen is in a dish
  private countHitRateAllergens(
    dishAllergens: string[], allergens: string[], count: number) {

    let hitControl = 0;
    for (const allergen of dishAllergens) {
      for (const lookingFor of allergens) {
        if (allergen.toLowerCase()
          .includes(lookingFor.toLowerCase())) {
          count++;
          hitControl++;
        }
      }
    }
    if (hitControl > 0) {
      count = count - (hitControl - 1);
    }
    return count;
  }

  async filterForRestaurantWithNameOrGroup(lookingFor: string[]) {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();
    for (const restaurant of await this.restaurants) {
      let inserted = false;
      let countName = 0;
      let countGroup = 0;
      let hitRateName = 0;
      let hitRateGroup = 0;
      let max = 0;
      if (lookingFor[0] === '') {
        results.push(this.createRestaurantObjFe(
          restaurant as IRestaurantBackEnd, 100));
        continue;
      }

      for (const searchedWord of lookingFor) {
        // Check if name of restaurant contains searched word --> return RestaurantObj with 100% hitRate
        // stop if finding name directly
        if (restaurant.name && restaurant.name.toLowerCase()
          .includes(searchedWord.toLowerCase())) {
          results.push(this.createRestaurantObjFe(
            restaurant as IRestaurantBackEnd, 100));
          inserted = true;
          break;
        }

        // Check if name of the dish contains searched word --> calculate hitRate
        for (const dish of restaurant.dishes) {
          let found = false;
          if (dish.name.toLowerCase()
            .includes(searchedWord.toLowerCase())) {
            countName++;
            hitRateName = (countName / restaurant.dishes.length) * 100;
            found = true;
          }
          // Check if foodGroup of the dish contains searched word --> calculate hitRate
          if (!dish.category.foodGroup) {
            break;
          }
          for (const group of dish.category.foodGroup.split(',')) {
            if (found)
              break;
            if (group.toLowerCase()
              .includes(searchedWord.toLowerCase())) {
              max = dish.category.foodGroup.split(',').length;
              countGroup++;
              hitRateGroup = (countGroup / max) * 100;
              found = true;
            }
          }
        }

      }
      // If not inserted directly by name, create RestaurantObj with hitRate
      if (!inserted) {
        results.push(this.createRestaurantObjFe(
          restaurant as IRestaurantBackEnd,
          Math.max(hitRateName, hitRateGroup)
        ));
      }
    }
    // Sort results by hitRate
    results.sort((a, b) => (a.hitRate < b.hitRate) ? 1 : -1);
    return results;
  }

  async filterForRestaurantWithRating(lookingFor: number[]) {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();

    for (const restaurant of await this.restaurants) {
      let inserted = false;
      // Check if rating of restaurant is between the two numbers --> return RestaurantObj with 100% hitRate
      if (restaurant.rating >= lookingFor[0] &&
        restaurant.rating <= lookingFor[1]) {
        inserted = true;
        results.push(this.createRestaurantObjFe(
          restaurant as IRestaurantBackEnd, 100));
      }
      // If not inserted directly by rating, create RestaurantObj with hitRate == 0
      if (!inserted) {
        results.push(this.createRestaurantObjFe(
          restaurant as IRestaurantBackEnd, 0));
      }
    }
    results.sort((a, b) => (a.hitRate < b.hitRate) ? 1 : -1);
    return results;
  }

  async filterForRestaurantWithCategory(lookingFor: string[]) {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();
    for (const restaurant of await this.restaurants) {
      let inserted = false;
      let count = 0;
      const hitRate = 0;
      let max = 0;
      for (const searchedWord of lookingFor) {
        // Check if category of restaurant contains searched word --> return RestaurantObj with 100% hitRate
        // stop if finding category directly
        let hitRate = 0;
        for (const category of restaurant.dishes) {
          if (category.category.foodGroup && category.category.foodGroup
            .toLowerCase()
            .includes(searchedWord.toLowerCase())) {
            count++;
            max = restaurant.dishes.length;
            hitRate = (count / max) * 100;
            results.push(this.createRestaurantObjFe(
              restaurant as IRestaurantBackEnd, hitRate));
            inserted = true;
            break;
          }
        }
      }
      // If not inserted directly by category, create RestaurantObj with hitRate
      if (!inserted) {
        results.push(
          this.createRestaurantObjFe(
            restaurant as IRestaurantBackEnd, hitRate));
      }
    }
    results.sort((a, b) => (a.hitRate < b.hitRate) ? 1 : -1);
    return results;
  }

  async filterForRestaurantWithLocation(lookingFor: string) {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();
    for (const restaurant of await this.restaurants) {
      let inserted = false;
      if (restaurant.location?.city && typeof lookingFor === 'string' &&
        typeof restaurant.location.city === 'string' &&
        restaurant.location.city.toLowerCase()
          .includes(lookingFor.toLowerCase())) {
        inserted = true;
        results.push(
          this.createRestaurantObjFe(restaurant as IRestaurantBackEnd, 100));
      }
      if (!inserted) {
        results.push(
          this.createRestaurantObjFe(restaurant as IRestaurantBackEnd, 0));
      }
    }
    results.sort((a, b) => (a.hitRate < b.hitRate) ? 1 : -1);
    return results;
  }

  async returnDefaultQuery() {
    const results = [{} as IRestaurantFrontEnd];
    results.pop();
    for (const restaurant of await this.restaurants) {
      results.push(this.createRestaurantObjFe(
        restaurant as IRestaurantBackEnd, 100));
    }
    return results;
  }
}
