checkIfRestaurantExists():
--------------------------

```java
export async function checkIfRestaurantExists(restaurantName: string) {
  const restaurant = await getRestaurantByName(restaurantName);
  return !!restaurant;
}
```

Takes the restaurant name as argument and will return true or false depending if the restaurant exists or not.

findMaxIndexRestaurants():
--------------------------

```java
export async function findMaxIndexRestaurants() {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find()
    .sort({ _id: -1 })
    .limit(1);
  if (restaurants.length === 0) return 0;
  return restaurants[0]._id;
}
```

Will return the last assigned id for the restuarants.