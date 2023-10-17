Get all dishes:
---------------

```java
router.get('/', async (_req, res) => {
  const dishes = await getAllDishes();
  return res.status(200)
    .send(dishes);
});
```

Get dishes from restaurant:
---------------------------

```java
router.get('/:name', async (req, res) => {
  if (!await checkIfRestaurantExists(req.params.name)) {
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  }
  const dishes = await getDishesByRestaurantName(req.params.name);
  return res.status(200)
    .send(dishes);
});
```

Add dish to restaurant:
-----------------------

```java
router.post('/:name', async (req, res) => {
  if (!await checkIfRestaurantExists(req.params.name)) {
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  }
  if (!checkIfNameExists(req.body)) {
    return res.status(404)
      .send('Name is missing');
  }
  if (await getDishByName(req.params.name, req.body.name)) {
    return res.status(404)
      .send('There is already a dish with the name ' + req.body.name);
  }
  const dish = await createNewDish(req.params.name, req.body);
  return res.status(200)
    .send(dish);
});
```

Delete dish from restaurant:
----------------------------

```java
router.delete('/:name', async (req, res) => {
  if (!await checkIfRestaurantExists(req.params.name)) {
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  }
  const dish = await deleteDishByName(req.params.name, req.body.name);
  return res.status(200)
    .send(dish);
});
```

Update dish:
------------

```java
router.put('/:name', async (req, res) => {
  if (!await checkIfRestaurantExists(req.params.name)) {
    return res.status(404)
      .send('Coudnt find restaurant named ' + req.params.name);
  }
  if (!await getDishByName(req.params.name, req.body.name)) {
    return res.status(404)
      .send('Coundt find dish named ' + req.body.name);
  }
  const dish = await changeDishByName(req.params.name, req.body);
  return res.status(200)
    .send(dish);
});
```