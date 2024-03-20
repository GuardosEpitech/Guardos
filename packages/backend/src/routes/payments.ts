import * as express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

router.post('/create-checkout-session',
  async (req: express.Request, res: express.Response) => {
    try {
      console.log(process.env.STRIPE_SECRET_KEY);
      const domainURL = req.body.domainURL;

      if (!domainURL) {
        return res.status(400)
          .send({ error: 'domainURL is required' });
      }

      const session = await stripe.checkout.sessions.create({
        // eslint-disable-next-line camelcase
        payment_method_types: ['card'],
        // eslint-disable-next-line camelcase
        line_items: [{
          price: process.env.FREE_PAYMENT as string,
          quantity: 1,
        }],
        mode: 'payment',
        // eslint-disable-next-line camelcase
        success_url: `${domainURL}/payment-success`,
        // eslint-disable-next-line camelcase
        cancel_url: `${domainURL}/payment-failed`,
      });

      res.redirect(303, session.url);
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      res.status(500)
        .send({ error: error.message });
    }
  });

export default router;
