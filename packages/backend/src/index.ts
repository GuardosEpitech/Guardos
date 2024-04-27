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
import featureRequest from './routes/featureRequest';
import review from './routes/review';
import menu from './routes/menu';

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
    app.use('/api/foodCategorie', foodCategorie);
    app.use('/api/profile/resto', restoProfile);
    app.use('/api/permissions/visitor', visitorPermissions);
    app.use('/api/payments', payments);
    app.use('/api/featureRequest', featureRequest);
    app.use('/api/review', review);
    app.use('/api/favourites', favourites);
    app.use('/api/menuDesigns', menuDesigns);
  }

  app.use(function (_req, _res, next) {
    const err = createError(404);
    next(err);
  });

  // error handler
  app.use(function (err: any, req: any, res: any) { /* eslint-disable-line */
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

try {
  main();
} catch (err: unknown) {
  console.log(err);
}
