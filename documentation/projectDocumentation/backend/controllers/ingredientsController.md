This file handles everything related to handle the ingredients.

createNewIngredient():
----------------------

```java
export async function createNewIngredient(name: string, id: number,
  allergens: string[]) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  const upload = new IngredientSchema({
    _id: id,
    name: name,
    allergens: allergens,
  });
  await upload.save();
  console.log('Ingredient ' + name + ' saved ' + ' with id ' + id);
}
```

This function has three arguments:

*   name: a string that represents the name of the ingredient
    
*   id: the id for that ingredient
    
*   allergens: a string array that contains every allergen from the ingredient
    

First the function gets the mongoose schema and creates and object filled with all data. Once it is created the function will upload it to our database. After it was uploaded it will print out the name and id of the saved ingredient.

getAllIngredients():
--------------------

```java
export async function getAllIngredients() {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  return IngredientSchema.find();
}
```

This function returns all ingredients that are stored in our database.

getIngredientByName():
----------------------

```java
export async function getIngredientByName(name: string) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  return IngredientSchema.find({name: name});
}
```

This function takes the ingredient name as argument and returns the ingredient if it exists.

deleteIngredient():
-------------------

```java
export async function deleteIngredient(name: string, id: number) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  await IngredientSchema.deleteOne({_id: id});
  console.log('Ingredient ' + name + ' deleted ' + ' with id ' + id);
}
```

This function takes the name and id of the ingredient as argument and deletes the ingredient if the name and id match an entry in our database.

findMaxIndexIngredients():
--------------------------

```java
export async function findMaxIndexIngredients() {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  const ingredients = await IngredientSchema.find()
    .sort({_id: -1})
    .limit(1);
  if (ingredients.length === 0) return 0;
  return ingredients[0]._id;
}
```

This function returns the last assigned id for ingredients.