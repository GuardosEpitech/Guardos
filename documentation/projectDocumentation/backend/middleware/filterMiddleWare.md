handleFilterRequest():
----------------------

```java
export const handleFilterRequest = async function
(filterReq: ISearchCommunication) {
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
```

This function takes all search criteria as argument and returns a sorted list of the restaurants.