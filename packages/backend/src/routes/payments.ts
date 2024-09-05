import * as express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import { 
  getUserId, 
  addCustomer, 
  getCustomer,
  getProfileDetails,
  getSubscribeTime,
  addSubscribeTime,
  addSubscribtionID,
  deleteSubscribtionID
} from '../controllers/userController';
import { 
  getUserIdResto, 
  addCustomerResto, 
  getCustomerResto, 
  getRestoProfileDetails,
  getSubscribeTimeUserResto,
  addSubscribeTimeResto,
  addSubscribtionIDResto,
  deleteSubscribtionIDResto
} from '../controllers/userRestoController';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

router.get('/stripe-key', (_, res) => {
  return res.send({publishableKey: process.env.STRIPE_PUBLISHABLE_KEY});
});

router.post('/create-checkout-session',
  async (req: express.Request, res: express.Response) => {
    try {
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
      console.error('Error while creating checkout-Session for free product:'
        , error);
      res.status(500)
        .send({ error: error.message });
    }
  });

  async function createCustomerVisitor(userID: number): Promise<string> {
    try {
      const user = await getProfileDetails(userID);
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
      });
      const customerID = await addCustomer(userID, customer.id);
      return customerID;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  };

router.post('/addCustomerVisitor', 
  async (req: express.Request, res: express.Response) => {
  try {
    const {userToken} = req.body;

    if (!userToken) {
      return res.status(404).send({ error: 'No UserToken' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await createCustomerVisitor(userID);
    res.status(200).send(customerID);

  } catch (error) {
    console.error('Error while creating a customer:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.get('/getCustomerVisitor',
  async (req: express.Request, res: express.Response) => {
  try {
    const userToken = String(req.query.key);

    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    res.status(200).send(customerID);

  } catch (error) {
    console.error('Error while fetching a customer:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.post('/save/create-checkout-session', async (req, res) => {
  try {
    const domainURL = req.body.domainURL;
    const customerID = req.body.customerId;

      if (!domainURL) {
        return res.status(400)
          .send({ error: 'domainURL is required' });
      }
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      payment_method_types: ['card'],
      success_url: `${domainURL}/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel`,
      customer: customerID
    });
    res.redirect(303, session.url);
  } catch (error) {
    console.error('Error while creating setup session:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.get('/showPaymentMethodsVisitor', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerID
    );
    const transformedPaymentMethods = paymentMethods.data.map(method => ({
      name: method.billing_details.name,
      brand: method.card.brand,
      exp_month: method.card.exp_month,
      exp_year: method.card.exp_year,
      last4: method.card.last4,
      id: method.id
    }));

    res.status(200).send(transformedPaymentMethods);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.post('/deletePaymentMethod', async (req, res) => {
  try {
    const { paymentID } = req.body;
    
    if (!paymentID) {
      return res.status(404).send({ error: 'No PaymentID' });
    }
    const paymentMethod = await stripe.paymentMethods.detach(
      paymentID
    );

    if (paymentMethod.customer) {
      return res.status(400).send({error: 'Failed to delete payment method'});
    }

    res.status(200).send(true);
  } catch (error) {
    console.error('Error while deleting a payment method:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

async function createCustomerResto(userID: number): Promise<string> {
  try {
    const user = await getRestoProfileDetails(userID);
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
    });

    const customerID = await addCustomerResto(userID, customer.id);

    return customerID;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

router.post('/addCustomerResto', 
async (req: express.Request, res: express.Response) => {
try {
  const {userToken} = req.body;

  if (!userToken) {
    return res.status(404).send({ error: 'No UserToken' });
  }
  const userID = await getUserIdResto(userToken);
  if (typeof userID !== 'number') {
    return res.status(404).send({ error: 'No UserID' });
  }
  const customerID = await createCustomerResto(userID);
  res.status(200).send(customerID);

} catch (error) {
  console.error('Error while creating a customer:'
      , error);
    res.status(500)
      .send({ error: error.message });
}
});

router.get('/getCustomerResto',
async (req: express.Request, res: express.Response) => {
try {
  const userToken = String(req.query.key);

  if (!userToken) {
    return res.status(404).send({ error: 'No User Token' });
  }
  const userID = await getUserIdResto(userToken);
  if (typeof userID !== 'number') {
    return res.status(404).send({ error: 'No UserID' });
  }
  const customerID = await getCustomerResto(userID);
  res.status(200).send(customerID);

} catch (error) {
  console.error('Error while fetching a customer:'
      , error);
    res.status(500)
      .send({ error: error.message });
}
});

router.get('/showPaymentMethodsResto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerID
    );
    const transformedPaymentMethods = paymentMethods.data.map(method => ({
      name: method.billing_details.name,
      brand: method.card.brand,
      exp_month: method.card.exp_month,
      exp_year: method.card.exp_year,
      last4: method.card.last4,
      id: method.id
    }));

    res.status(200).send(transformedPaymentMethods);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.post('/payment-sheet-setup-intent-visitor', async (req, res) => {
  const {
    userToken,
  } = req.body;

  if (!userToken) {
    return res.status(404).send({ error: 'No User Token' });
  }
  const userID = await getUserId(userToken);
  if (typeof userID !== 'number') {
    return res.status(404).send({ error: 'No UserID' });
  }
  const customerID = await getCustomer(userID);
  if (typeof customerID !== 'string') {
    return res.status(404).send({ error: 'No CustomerID' });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customerID},
    {apiVersion: '2023-10-16'},
  );
  const setupIntent = await stripe.setupIntents.create({
    ...{customer: customerID, payment_method_types: ['card']},
  });

  return res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerID,
  });
});

router.post('/payment-sheet-setup-intent-resto', async (req, res) => {
  const {
    userToken,
  } = req.body;

  if (!userToken) {
    return res.status(404).send({ error: 'No User Token' });
  }
  const userID = await getUserIdResto(userToken);
  if (typeof userID !== 'number') {
    return res.status(404).send({ error: 'No UserID' });
  }
  const customerID = await getCustomerResto(userID);
  if (typeof customerID !== 'string') {
    return res.status(404).send({ error: 'No CustomerID' });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customerID},
    {apiVersion: '2023-10-16'},
  );
  const setupIntent = await stripe.setupIntents.create({
    ...{customer: customerID, payment_method_types: ['card']},
  });

  return res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerID,
  });
});

router.get('/subscribedTime-resto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    let time = await getSubscribeTimeUserResto(userID as number);

    res.status(200).send(time);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.post('/subscribedTime-resto', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    let time = await addSubscribeTimeResto(userID as number);

    res.status(200).send(time);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.get('/subscribedTime-visitor', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    let time = await getSubscribeTime(userID as number);

    res.status(200).send(time);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

router.post('/subscribedTime-visitor', async (req, res) => {
  try {
    const userToken = String(req.query.key);
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    let time = await addSubscribeTime(userID as number);

    res.status(200).send(time);
  } catch (error) {
    console.error('Error while fetching a payment methods:'
        , error);
      res.status(500)
        .send({ error: error.message });
  }
});

// Create a route to handle subscription creation
router.post("/create-subscription-resto", async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const priceId = req.body.priceId;

    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }
  
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerID
    );
    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: priceId }], // priceId should be the ID of the price for the plan
      expand: ["latest_invoice.payment_intent"],
      default_payment_method: paymentMethods.data[0].id
    });

    let returnValue = await addSubscribtionIDResto(userID, subscription.id);

    // Respond with the subscription details
    res.status(200).send(returnValue);
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Route to get subscription details
router.get("/get-subscription-resto", async (req, res) => {
  try {
    const subscriptionId = req.body.subscriptionId;
    const userToken = String(req.query.key);

    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Respond with the subscription details
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error retrieving subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Route to cancel a subscription
router.delete("/delete-subscription-resto", async (req, res) => {
  try {
    const subscriptionId = req.body.subscriptionId;
    const userToken = String(req.query.key);
    
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserIdResto(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomerResto(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }
    // Cancel the subscription in Stripe
    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

    await deleteSubscribtionIDResto(userID);

    // Respond with the result of the cancellation
    res.status(200).json(deletedSubscription);
  } catch (error) {
    console.error("Error deleting subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Create a route to handle subscription creation
router.post("/create-subscription-visitor", async (req, res) => {
  try {
    const userToken = String(req.query.key);
    const priceId = req.body.priceId;

    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }
  
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerID
    );
    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: priceId }], // priceId should be the ID of the price for the plan
      expand: ["latest_invoice.payment_intent"],
      default_payment_method: paymentMethods.data[0].id
    });

    let returnValue = await addSubscribtionID(userID, subscription.id);

    // Respond with the subscription details
    res.status(200).send(returnValue);
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Route to get subscription details
router.get("/get-subscription-visitor", async (req, res) => {
  try {
    const subscriptionId = req.body.subscriptionId;
    const userToken = String(req.query.key);

    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }

    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Respond with the subscription details
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error retrieving subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Route to cancel a subscription
router.delete("/delete-subscription-visitor", async (req, res) => {
  try {
    const subscriptionId = req.body.subscriptionId;
    const userToken = String(req.query.key);
    
    if (!userToken) {
      return res.status(404).send({ error: 'No User Token' });
    }
    const userID = await getUserId(userToken);
    if (typeof userID !== 'number') {
      return res.status(404).send({ error: 'No UserID' });
    }
    const customerID = await getCustomer(userID);
    if (typeof customerID !== 'string') {
      return res.status(404).send({ error: 'No CustomerID' });
    }
    // Cancel the subscription in Stripe
    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

    await deleteSubscribtionID(userID);

    // Respond with the result of the cancellation
    res.status(200).json(deletedSubscription);
  } catch (error) {
    console.error("Error deleting subscription:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
