Handle login:
-------------

```java
router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await loginUser(data.username, data.password);

    if (answer) {
      return res.send(data);
    } else {
      return res.status(403)
        .send('Invalid Access');
    }
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});
```