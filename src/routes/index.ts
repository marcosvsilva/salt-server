import express, { Request, Response, Router } from 'express';

import { PriceController } from '../controllers/prices.controller';

const router: Router = express.Router();

/**
 * Lists
 */

// const routerList = '/api/lists';
// router.get(routerList, listsController.index);
// router.get(`${routerList}/:uuid`, listsController.show);
// router.post(routerList, listsController.create);
// router.put(`${routerList}/:uuid`, listsController.update);
// router.delete(`${routerList}/:uuid`, listsController.remove);

/**
 * Users
 */

// const routerUser = '/api/users';
// router.get(routerUser, usersController.index);
// router.get(`${routerUser}/:uuid`, usersController.show);
// router.post(routerUser, usersController.create);
// router.put(`${routerUser}/:uuid`, usersController.update);
// router.delete(`${routerUser}/:uuid`, usersController.remove);

/**
 * Products
 */

// const routerProducts = '/api/products';
// router.get(routerProducts, productsController.index);
// router.get(`${routerProducts}/:uuid`, productsController.show);
// router.post(routerProducts, productsController.create);
// router.put(`${routerProducts}/:uuid`, productsController.update);
// router.delete(`${routerProducts}/:uuid`, productsController.remove);

/**
 * Prices
 */

// Create an instance of PriceController
const priceController = new PriceController();
const routerPrices = '/api/prices';

// GET /api/prices
router.get(routerPrices, priceController.index);

// GET /api/prices/:uuid
router.get(`${routerPrices}/:uuid`, priceController.show);

// POST /api/prices
router.post(routerPrices, priceController.create);

// PUT /api/prices/:uuid
router.put(`${routerPrices}/:uuid`, priceController.update);

// DELETE /api/prices/:uuid
router.delete(`${routerPrices}/:uuid`, priceController.delete);

/**
 * Root
 */

router.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Salt Software' })
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
