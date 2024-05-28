import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import filter from './routes/filter';
import register from './routes/register';
import login from './routes/login';
import user from './routes/user';
import images from './routes/images';
import logout from './routes/logout';
import deleteUser from './routes/deleteUsers';
import payments from './routes/payments';
import foodCategorie from './routes/foodCategories';
import favourites from './routes/favourites';
import menuDesigns from './routes/menuDesigns';
import logger from 'morgan';
import path = require('path');
import 'dotenv/config';
import bodyParser from 'body-parser';

import basicApiIngredients from './routes/ingredients';
import { connectDataBase, SUCCEED } from './controllers/connectDataBase';
import dishes from './routes/dishes';
import products from './routes/products';
import restaurants from './routes/restaurants';
import restaurantsSearch from './routes/restoFilter';
import email from './routes/email';
import visitorProfile from './routes/visitorProfile';
import restoProfile from './routes/restoProfile';
import visitorPermissions from './routes/visitorPermissions';
import restoPermissions from './routes/restoPermissions';
import featureRequest from './routes/featureRequest';
import review from './routes/review';
import menu from './routes/menu';
import map from './routes/map';

function constructAllowedOrigins(): string[] {
  const domains: { [key: string]: string | undefined } = {
    RW: process.env.allowedRW,
    VW: process.env.allowedVW,
  };

  const needsPort = (domain: string | undefined): boolean => {
    return domain ? domain.endsWith(':') : false;
  };
  return Object.keys(domains)
    .map((key) => {
      const base = domains[key];
      const portVar = `PORT${key}`;
      const port = process.env[portVar];

      if (!base) {
        throw new Error(`Environment variable ${key} is not defined`);
      }

      return needsPort(base) && port ? `${base}${port}` : base;
    });
}

async function main() {
  const app = express();

  const allowedOrigins = constructAllowedOrigins();
  console.log('Allowed Origins:', allowedOrigins);
  app.use(logger('dev'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  if (await connectDataBase() === SUCCEED) {
    app.listen(process.env.PORTBE, () => {
      return console.log(`Backend is listening at http://localhost:${process.env.PORTBE}`);
    });

    const asyncHandler = (fn:any) => (req:any, res:any, next:any) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

    app.use('/api/logout', asyncHandler(logout));
    app.use('/api/products', asyncHandler(products));
    app.use('/api/dishes', asyncHandler(dishes));
    app.use('/api/restaurants', asyncHandler(restaurants));
    app.use('/api/search/restaurants', asyncHandler(restaurantsSearch));
    app.use('/api/menu', asyncHandler(menu));
    app.use('/api/ingredients', asyncHandler(basicApiIngredients));
    app.use('/api/filter', asyncHandler(filter));
    app.use('/api/register', asyncHandler(register));
    app.use('/api/login', asyncHandler(login));
    app.use('/api/user', asyncHandler(user));
    app.use('/api/images', asyncHandler(images));
    app.use('/api/sendEmail', asyncHandler(email));
    app.use('/api/delete/', asyncHandler(deleteUser));
    app.use('/api/profile', asyncHandler(visitorProfile));
    app.use('/api/foodCategorie', asyncHandler(foodCategorie));
    app.use('/api/profile/resto', asyncHandler(restoProfile));
    app.use('/api/permissions/visitor', asyncHandler(visitorPermissions));
    app.use('/api/permissions/resto', asyncHandler(restoPermissions));
    app.use('/api/payments', asyncHandler(payments));
    app.use('/api/featureRequest', asyncHandler(featureRequest));
    app.use('/api/review', asyncHandler(review));
    app.use('/api/favourites', asyncHandler(favourites));
    app.use('/api/menuDesigns', asyncHandler(menuDesigns));
    app.use('/api/map', asyncHandler(map));
  }

  // Catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    const err = createError(404);
    next(err);
  });

  // Error handler
  app.use((err:any, req:any, res:any, _next:any) => {
    // Log the error for internal use
    console.error(err);

    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Respond with a user-friendly message
    res.status(err.status || 500);
    res.json({
      message: 'An error occurred. Please try again later.',
      error: req.app.get('env') === 'development' ? err.message : {},
    });
  });
}

try {
  main();
} catch (err: unknown) {
  console.log(err);
}
