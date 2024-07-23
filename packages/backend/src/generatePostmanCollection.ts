import express from 'express';
import listEndpoints from 'express-list-endpoints';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const importRoutes = async (app: express.Application) => {
  const { default: filter } = await import('./routes/filter');
  const { default: register } = await import('./routes/register');
  const { default: login } = await import('./routes/login');
  const { default: user } = await import('./routes/user');
  const { default: images } = await import('./routes/images');
  const { default: logout } = await import('./routes/logout');
  const { default: deleteUser } = await import('./routes/deleteUsers');
  const { default: payments } = await import('./routes/payments');
  const { default: favourites } = await import('./routes/favourites');
  const { default: menuDesigns } = await import('./routes/menuDesigns');
  const { default: basicApiIngredients } = await import('./routes/ingredients');
  const { default: dishes } = await import('./routes/dishes');
  const { default: products } = await import('./routes/products');
  const { default: restaurants } = await import('./routes/restaurants');
  const { default: restaurantsSearch } = await import('./routes/restoFilter');
  const { default: email } = await import('./routes/email');
  const { default: visitorProfile } = await import('./routes/visitorProfile');
  const { default: restoProfile } = await import('./routes/restoProfile');
  const { default: visitorPermissions } =
      await import('./routes/visitorPermissions');
  const { default: restoPermissions } =
      await import('./routes/restoPermissions');
  const { default: featureRequest } = await import('./routes/featureRequest');
  const { default: userSupport } = await import('./routes/userSupport');
  const { default: review } = await import('./routes/review');
  const { default: menu } = await import('./routes/menu');
  const { default: map } = await import('./routes/map');

  app.use('/api/logout', logout);
  app.use('/api/products', products);
  app.use('/api/dishes', dishes);
  app.use('/api/restaurants', restaurants);
  app.use('/api/search/restaurants', restaurantsSearch);
  app.use('/api/menu', menu);
  app.use('/api/ingredients', basicApiIngredients);
  app.use('/api/filter', filter);
  app.use('/api/register', register);
  app.use('/api/login', login);
  app.use('/api/user', user);
  app.use('/api/images', images);
  app.use('/api/sendEmail', email);
  app.use('/api/delete/', deleteUser);
  app.use('/api/profile', visitorProfile);
  app.use('/api/profile/resto', restoProfile);
  app.use('/api/permissions/visitor', visitorPermissions);
  app.use('/api/permissions/resto', restoPermissions);
  app.use('/api/payments', payments);
  app.use('/api/featureRequest', featureRequest);
  app.use('/api/userSupport', userSupport);
  app.use('/api/review', review);
  app.use('/api/favourites', favourites);
  app.use('/api/menuDesigns', menuDesigns);
  app.use('/api/map', map);
};

async function generatePostmanCollection() {
  const app = express();

  await importRoutes(app);

  const endpoints = listEndpoints(app);

  const postmanCollection = {
    info: {
      name: 'Generated Postman Collection',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: endpoints.map((endpoint) => ({
      name: endpoint.path,
      request: {
        method: endpoint.methods[0],
        header: [],
        url: {
          raw: `{{base_url}}${endpoint.path}`,
          host: ['{{base_url}}'],
          path: endpoint.path.split('/')
            .filter(Boolean),
        },
      },
    })),
  };

  fs.writeFileSync(
    path.join(__dirname, '../postman_collection.json'),
    JSON.stringify(postmanCollection, null, 2)
  );

  console.log('Postman collection generated successfully!');
}

generatePostmanCollection()
  .catch(console.error);
