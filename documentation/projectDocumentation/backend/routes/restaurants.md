Get all restaurants:
--------------------

```java
router.get('/', async (_req, res) => {
  const restaurant = await getAllRestaurants();
  return res.status(200)
    .send(restaurant);
});
```

Get restaurant by name:
-----------------------

```java
router.get('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  return res.status(200)
    .send(restaurant);
});
```

Create new restaurant:
----------------------

```java
router.post('/', async (req, res) => {
  const maxID = await findMaxIndexRestaurants();
  const restaurant = await createNewRestaurant(req.body, maxID + 1);
  return res.status(200)
    .send(restaurant);
});
```

Delete restaurant:
------------------

```java
router.delete('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  const answerRestaurant = deleteRestaurantByName(req.params.name);
  return res.status(200)
    .send(answerRestaurant);
});
```

Update restaurant:
------------------

```java
router.put('/:name', async (req, res) => {
  const restaurant = await getRestaurantByName(req.params.name);
  if (!restaurant)
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  const answer = await changeRestaurant(req.body, req.params.name);
  return res.status(200)
    .send(answer);
});
```