User registration:
------------------

```java
router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const errArray = await addUser(data.username, data.email, data.password);

    return res.send(errArray);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});
```