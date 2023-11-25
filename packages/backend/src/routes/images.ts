import * as express from 'express';

const router = express.Router();

router.get('/', async (_req, res) => {
  return res.status(200).send("Get Images");
});

router.post('/:name', async (_req, res) => {
  return res.status(200).send("Post Images");;
});

router.delete('/:name', async (_req, res) => {
  return res.status(200).send("Delete Images");;
});

router.put('/:name', async (_req, res) => {
  return res.status(200).send("Put Images");;
});

export default router;