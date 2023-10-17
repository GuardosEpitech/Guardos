This folder contains all backend routes.

Add new routes
--------------

To add new routes first create a new file, named after the route you want to create. Since the backend works with ‘express’, you need to import it.

```java
import * as express from 'express';
```

To define all the routes for the functions you need to use the ‘express.router’:

```java
const router = express.Router();
```

Now you can define all different routes.

Remember to add the route to ‘index.ts’.