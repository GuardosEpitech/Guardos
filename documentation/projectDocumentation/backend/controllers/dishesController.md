This file handles everything related to handling dishes.

getDishesByRestaurantName():
----------------------------

```java
export async function getDishesByRestaurantName(restaurantName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.find({ name: restaurantName }, 'dishes');
}
```

This function takes the name of a restaurant as argument and returns all dishes that are related to it.

getDishByName():
----------------

```java
export async function getDishByName(restaurantName: string, dishName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurant = await Restaurant.findOne({ name: restaurantName });
  if (!restaurant) return null;
  return restaurant.dishes.find((dish) => dish.name === dishName);
}
```

This function takes the restaurant name and a dish name as argument and returns the dish. If the restaurant or dish do not exist it returns “null”.

getAllDishes():
---------------

```java
export async function getAllDishes() {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const restaurants = await Restaurant.find();
  const dishes: IDishFE[] = [];
  for (const rest of restaurants) {
    for (const dish of rest.dishes) {
      const dishFE: IDishFE = {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        pictures: [''],
        allergens: [''],
        category: {} as ICategoryFE,
        resto: rest.name,
        products: dish.products
      };
      dishFE.pictures.pop();
      dishFE.allergens.pop();
      dishFE.category.foodGroup = dish.category.foodGroup;
      dishFE.category.extraGroup = dish.category.extraGroup;
      dishFE.category.menuGroup = dish.category.menuGroup;
      for (const pict of dish.pictures) {
        dishFE.pictures.push(pict);
      }

      for (const allergen of dish.allergens) {
        dishFE.allergens.push(allergen);
      }

      dishes.push(dishFE);
    }
  }
  return dishes;
}
```

This function returns all dishes from every restaurant.

deleteDish():
-------------

```java
async function deleteDish(restaurantName: string, dishName: string) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName },
    { $pull: { dishes: { name: dishName } } },
    { new: true }
  );
}
```

This function takes as argument the restaurant name and dish name. If the dish and restaurant exist it will delete the entry from our database.

createNewDish():
----------------

```java
export async function createNewDish(
  restaurantName: string, dishCom: IDishesCommunication) {
  const dish: IDishesCommunication = {
    name: dishCom.name,
    description: dishCom.description ? dishCom.description : '',
    price: dishCom.price ? dishCom.price : -1,
    products: dishCom.products ? dishCom.products : [''],
    pictures: dishCom.pictures ? dishCom.pictures : [''],
    allergens: dishCom.allergens ? dishCom.allergens : [''],
    category: dishCom.category ? dishCom.category : {
      menuGroup: '',
      foodGroup: '',
      extraGroup: [''],
    },
  };
  await createDish(restaurantName, dish);
  return dish;
}
```

This function takes the restaurant name and a dish object as arguments. It will then create a new dish object and call the “createDish()” function. As soon as “createDish()” finishes the function will return the dish object.

createDish():
-------------

```java
async function createDish(restaurantName: string, dish: IDishesCommunication) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName },
    { $push: { dishes: dish } },
    { new: true }
  );
}
```

This function takes the restaurant name and the dish object as arguments and creates this dish in our database under the restaurant, if the restaurant exists.

changeDishByName():
-------------------

```java
export async function changeDishByName(
  restaurantName: string, dish: IDishesCommunication) {
  const oldDish = await getDishByName(restaurantName, dish.name);
  const newDish: IDishBE = {
    //if the new dish has a property, use it, else use the old one
    name: dish.name ? dish.name : oldDish.name,
    id: 6, // TODO: change that
    description: dish.description ? dish.description : oldDish.description,
    price: dish.price ? dish.price : oldDish.price,
    products: dish.products ? dish.products : oldDish.products as [string],
    pictures: dish.pictures ? dish.pictures : oldDish.pictures as [string],
    allergens: dish.allergens ? dish.allergens as [string] :
      oldDish.allergens as [string],
    category: dish.category ? dish.category : oldDish.category as {
      menuGroup: string;
      foodGroup: string;
      extraGroup: [string];
    }
  };
  await updateDish(restaurantName, newDish);
  return newDish;
}
```

This function takes the restaurant name and a dish object as argument and first gets the current dish from our database and creates a new dish object with the updated data. After that it will call “updateDish()” and after the function finishes it will return the updated dish.

updateDish():
-------------

```java
export async function updateDish(
  restaurantName: string, dish: IDishBE) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  return Restaurant.findOneAndUpdate(
    { name: restaurantName, 'dishes.name': dish.name },
    { $set: { 'dishes.$': dish } },
    { new: true }
  );
}
```

This function takes restaurant name and a dish object as argument and if the dish is found in the restaurant object the dish data gets updated.