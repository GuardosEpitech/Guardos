import Filter from '../controllers/restaurantFilterController';
import { ISearchCommunication } from '../models/communicationInterfaces';
import { IFilterObj } from '../models/filterInterfaces';
import { IRestaurantFrontEnd, IRestaurantBackEnd }
  from '../../../shared/models/restaurantInterfaces';
import { readAndGetAllRestaurants }
  from '../controllers/connectDataBase';

export const handleFilterRequest =
  async function (filterReq: ISearchCommunication) {
    let check = 0;
    const filter = new Filter();
    const result = filter.returnDefaultQuery();
    const tmpFilterObj: IFilterObj = {
      savedFilter: filterReq,
      savedRestaurants: []
    };

    tmpFilterObj.savedFilter = filterReq;
    if (filterReq.name !== undefined) {
      try {
        tmpFilterObj.savedRestaurants
          .push(await filter
            .filterForRestaurantWithNameOrGroup([filterReq.name]));
        check++;
      } catch (error) {
        console.error(error);
        throw new Error('Error occurred while filtering restaurants by name.');
      }
    }
    if (filterReq.allergenList !== undefined) {
      try {
        tmpFilterObj.savedRestaurants
          .push(await filter
            .filterForRestaurantsWithAllergens(filterReq.allergenList));
        check++;
      } catch (error) {
        console.error(error);
        throw new Error('Error while filtering restaurants by allergene.');
      }
    }
    if (filterReq.categories !== undefined) {
      try {
        tmpFilterObj.savedRestaurants
          .push(await filter
            .filterForRestaurantWithCategory(filterReq.categories));
        check++;
      } catch (error) {
        console.error(error);
        throw new Error('Error while filtering restaurants by category.');
      }
    }
    if (filterReq.rating !== undefined) {
      try {
        tmpFilterObj.savedRestaurants
          .push(await filter.filterForRestaurantWithRating(filterReq.rating));
        check++;
      } catch (error) {
        console.error(error);
        throw new Error('Error while filtering restaurants by rating.');
      }
    }
    // if (obj.range !== undefined) {
    //   tmpFilterObj.savedRestaurants.push(await filter.filterForRestaurantWithRange(obj.range));
    //   check++;
    // }

    if (filterReq.location !== undefined) {
      try {
        tmpFilterObj.savedRestaurants
          .push(await filter
            .filterForRestaurantWithLocation(filterReq.location));
        check++;
      } catch (error) {
        console.error(error);
        throw new Error('Error while filtering restaurants by location.');
      }
    }
    // compare all hitrates in tmpFilterObj and return IRestaurantFrontEnd[] with average hitRate
    try {
      if (check >= 1) {
        for (let i = 0; i < (await result).length; i++) {
          let hitrate = 0;
          for (const restaurants of tmpFilterObj.savedRestaurants) {
            for (const restaurant of restaurants) {
              if (restaurant.id === (await result)[i].id) {
                hitrate += restaurant.hitRate;
              }
            }
          }
          hitrate /= tmpFilterObj.savedRestaurants.length;
          (await result)[i].hitRate = hitrate;
        }
        (await result).sort((a, b) => (a.hitRate < b.hitRate) ? 1 : -1);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error occurred while processing filter results.');
    }
    return result;
  };

export const getSelectedFilterReq =
  async function (filters: ISearchCommunication) {
    const filter = new Filter();
    const restaurants = await readAndGetAllRestaurants();
    let filteredRestaurants: IRestaurantBackEnd[] = [];
    const result: IRestaurantFrontEnd[] = [];
    for (const elem of restaurants) {
      const obj: IRestaurantBackEnd = {
        id: elem.id,
        userID: elem.userID,
        name: elem.name,
        description: elem.description,
        rating: elem.rating,
        ratingCount: elem.ratingCount,
        openingHours: elem.openingHours,
        pictures: elem.pictures,
        products: elem.products,
        website: elem.website,
        phoneNumber: elem.phoneNumber,
        mealType: elem.mealType,
        dishes: elem.dishes,
        location: elem.location,
        extras: elem.extras
      };
      filteredRestaurants.push(obj);
    }

    if (filters.name) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase()
          .includes(filters.name.toLowerCase())
      );
    }

    if (filters.location !== undefined) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) => {
        if (restaurant.location.city === undefined) {
          return false;
        }
        return restaurant.location.city.toLowerCase()
          .includes(filters.location.toLowerCase());
      });
    }

    // Filter by rating
    if (filters.rating) {
      if (filters.rating.length === 1) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) =>
          restaurant.rating === filters.rating[0]);
      } else if (filters.rating.length === 2) {
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) =>
            restaurant.rating >= filters.rating[0] &&
            restaurant.rating <= filters.rating[1]
        );
      }
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        filters.categories.map((category) =>
          category.toLowerCase())
          .some((lowercaseCategory) =>
            restaurant.dishes.some((dish) =>
              dish.category.foodGroup.toLowerCase() === lowercaseCategory
            )
          )
      );
    }

    // Filter by allergenList
    if (filters.allergenList && filters.allergenList.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) =>
          !restaurant.dishes.some((dish) =>
            filters.allergenList?.some((allergen) =>
              dish.allergens?.includes(allergen)))
      );
    }

    for (const restaurant of filteredRestaurants) {
      try {
        const resto = await filter.createRestaurantObjFe(restaurant, 100);
        result.push(resto);
      } catch (error) {
        console.error(error);
        throw new Error('Error occurred while processing filter results.');
      }
    }
    return result;
  };
