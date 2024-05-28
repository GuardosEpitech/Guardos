import * as express from 'express';
import { geocodeAddress } from '../controllers/mapController';

const router = express.Router();

router.get('/geocode', async (req, res) => {
    try {
        const address = String(req.query.address);

        if (!address) {
            return res.status(400);
        }

        const answer = await geocodeAddress(address);
        
        return res.status(200).send(answer);
    } catch (error) {
        console.error(error);
        return res.status(404)
            .send('Geocode failed');
    }
});

export default router;