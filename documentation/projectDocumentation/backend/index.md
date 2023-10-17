This is the entry point of our backend. This sets everything up (l. 2-10), connects with the data base (l. 12-16), links to all routes (l.18-26) and handles errors (;. 28- 42).

Main:
-----

```java
async function main() {
  const app = express();
  const port = 8081;

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors({ origin: String('http://localhost:8080') }));

  if (await connectDataBase() === SUCCEED) {
    app.listen(port, () => {
      return console.log(`Backend is listening at http://localhost:${port}`);
    });
  }

  app.use('/', basicApiIngredients); // why we have two times basicApiIngredients?
  app.use('/api/products', products);
  app.use('/api/dishes', dishes);
  app.use('/api/restaurants', restaurants);
  app.use('/api/ingredients', basicApiIngredients);
  app.use('/api/filter', filter);
  app.use('/api/register', register);
  app.use('/api/login', login);
  app.use('/api/user', user);

  // catch 404 and forward to error handler
  app.use(function (next: any) { /* eslint-disable-line */
    next(createError(404));
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
```