Get sorted restaurants:
-----------------------

```java
router.post('/', async function (req: Request, res: Response) {
  try {
    const answer = await handleFilterRequest(req.body);
    return res.send(answer);
  } catch (error) {
    console.log(error);
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});
```