import express, { Request, Response, Router } from 'express';

import * as listsController from '../controllers/lists.controller';
import * as pricesController from '../controllers/prices.controller';
import * as productsController from '../controllers/products.controller';
import * as usersController from '../controllers/users.controller';

const router: Router = express.Router();

/**
 * Lists
 */

router.get('/api/lists', listsController.index);
router.get('/api/lists/:uuid', listsController.show);
router.post('/api/lists', listsController.create);
router.put('/api/lists/:uuid', listsController.update);
router.delete('/api/lists/:uuid', listsController.remove);

/**
 * Users
 */

router.get('/api/users', usersController.index);
router.get('/api/users/:uuid', usersController.show);
router.post('/api/users', usersController.create);
router.put('/api/users/:uuid', usersController.update);
router.delete('/api/users/:uuid', usersController.remove);

/**
 * Products
 */

router.get('/api/products', productsController.index);
router.get('/api/products/:uuid', productsController.show);
router.post('/api/products', productsController.create);
router.put('/api/products/:uuid', productsController.update);
router.delete('/api/products/:uuid', productsController.remove);

/**
 * Prices
 */

router.get('/api/prices', pricesController.index);
router.get('/api/prices/:uuid', pricesController.show);
router.post('/api/prices', pricesController.create);
router.put('/api/prices/:uuid', pricesController.update);
router.delete('/api/prices/:uuid', pricesController.remove);

/**
 * Root
 */

router.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Salt Software' }),
);

/**
 * Errors
 */

// 404
router.use((req: Request, res: Response) => {
  return res.status(404).send({ message: `404: Route ${req.url} not found.` });
});

// 500 - Any server error
router.use((err: Error, req: Request, res: Response) => {
  return res.status(500).send({ error: err });
});

export default router;
