This files contains three functions: connectDataBase(), createNewRestaurant() and readAndGetAllRestaurants().

connectDataBase():
------------------

```java
export async function connectDataBase() {
  dotenv.config();
  const userName = process.env.dbUser;
  const password = process.env.dbPassword;
  const cluster = process.env.dbCluster;
  const uri = `mongodb+srv://${userName}:${password}@${cluster}/Guardos?retryWrites=true&w=majority`;

  try {
    console.log('Connecting to database...');
    mongoose.set('strictQuery', false);
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoose.connection.once('open', async () => {
      console.log('Connected to Database');
    });
    return SUCCEED;
  } catch (e) {
    console.error(e);
    return FAILED;
  }
}
```

This function gets all required data from the system environment (username, password and cluster name of the database) and connects those to connection string. After that the function tries to connect to the database using “mongoose.connect()” and if successful returns “1”. Otherwise, in case the connection was unsuccessful the function prints the error message and returns “-1”.

createNewRestaurant():
----------------------

```java
export async function createNewRestaurant(obj: IRestaurantBackEnd, id: number) {
  const RestaurantSchema = mongoose.model('Restaurants', restaurantSchema);
  const upload = new RestaurantSchema({
    _id: id,
    name: obj.name,
    phoneNumber: obj.phoneNumber,
    website: obj.website,
    rating: obj.rating,
    ratingCount: obj.ratingCount,
    description: obj.description,
    dishes: obj.dishes,
    pictures: obj.pictures,
    openingHours: obj.openingHours,
    location: obj.location,
    mealType: obj.mealType,
    products: obj.products,
    extras: obj.extras,
  });
  upload.save();
  console.log('Restaurant ' + obj.name + ' saved ' + ' with id ' + id);
}
```

This function takes an object and id as arguments. Based on the arguments the function first creates a mongoose schema and then uploads it to the database.

readAndGetAllRestaurants():
---------------------------

```java
export async function readAndGetAllRestaurants() {
  console.log('Reading all restaurants');
  const RestaurantSchema = mongoose.model('Restaurants', restaurantSchema);
  return await RestaurantSchema.find();
}
```

This function returns all restaurants in our database. The return value is structured like our database structure for the restaurants.