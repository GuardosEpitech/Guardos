Get all products of restaurant:
-------------------------------

```java
router.get('/:name', async (req, res) => {
  const products = await getAllRestoProducts(req.params.name);
  return res.status(200)
    .send(products);
});
```