checkIfIdExists():
------------------

```java
export async function checkIfIdExists(id: number) {
  const IngredientSchema = mongoose.model('IngredientsMVP',
    ingredientsSchema);
  return await IngredientSchema.findOne({_id: id})
    .then((result) => {
      return result;
    });
}
```

This function takes a id as argument and returns the ingredient if an ingredient with that id exists.

checkIfNameAndIDExistsIngredients():
------------------------------------

```java
export async function checkIfNameAndIdExistsIngredients(
  req: IIngredientsCommunication) {

  const id = req.id ? req.id : (await findMaxIndexIngredients() + 1);
  if (!req.name || !id) {
    console.log('Missing name or id');
    return false;
  }
  const ingredient = await checkIfIdExists(id);

  return !ingredient;
}
```

This function takes an ingredient object as argument. It will then get the next available id and check if the ingredient has a name and the new id got created. It will the check if an ingredient with that id exists and return either true or false depending on the outcome of “checkIfIdExists()”.