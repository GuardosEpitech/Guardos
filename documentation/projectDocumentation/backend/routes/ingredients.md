Get all ingredients:
--------------------

```java
router.get('/', async (_req, res) => {
  const ingredients = await getAllIngredients();
  res.status(200)
    .send(ingredients);
});
```

Add ingredient to resto:
------------------------

```java
router.post('/', async (req, res) => {
  if (await checkIfNameAndIdExistsIngredients(
    req.body as IIngredientsCommunication)) {
    const id =
      req.body.id ? req.body.id : (await findMaxIndexIngredients() + 1);
    await createNewIngredient(req.body.name, id, req.body.allergens);

    await addRestoProduct({
      name: req.body.name,
      allergens: req.body.allergens,
      ingredients: req.body.ingredients,
    }, req.body.restoName);
    if (!await checkIfRestaurantExists(req.body.restoName)) {
      return res.status(200)
        .send('Coudnt find restaurant named ' +
          req.body.restoName +
          ' but added ingredient to ingredients database');
    }
    res.status(200)
      .send('Ingredient '
        + req.body.name + ' saved ' + ' with id ' + id);
  } else {
    res.status(400)
      .send('Missing name or wrong id for ingredient');
  }
});
```

Delete ingredient:
------------------

```java
router.delete('/', async (req, res) => {
  const id = req.body.id ? req.body.id
    : (await getIngredientByName(req.body.name));

  if (await checkIfIdExists(id)) {
    await deleteIngredient(req.body.name, id);
    res.status(200)
      .send('Ingredient '
        + req.body.name + ' deleted ' + ' with id ' + id);
  } else {
    res.status(400)
      .send('Ingredient not found');
  }
});
```