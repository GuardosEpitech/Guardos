import * as express from 'express';
import {
  geocodeAddress,
  revGeocodeAddress
} from '../controllers/mapController';

const router = express.Router();

router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400);
    }
    const answer = await geocodeAddress(address);
    return res.status(200)
      .send(answer);
  } catch (error) {
    console.error(error);
    return res.status(404)
      .send('Geocode failed');
  }
});

router.post('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    console.log('lat: ', lat, ' lng: ', lng);
    if (!lat && !lng) return res.status(400);
    const answer = await revGeocodeAddress(lat, lng);
    return res.status(200)
      .send(answer);
  } catch (error) {
    console.error('Error reverse geocoding: ', error);
    return res.status(404)
      .send('Reverse geocode failed');
  }
});

export default router;
