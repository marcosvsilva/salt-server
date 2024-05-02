import express, { Request, Response, Router } from 'express';

import { isNumeric } from '../helpers';
import brandRouters from './brand.router';
import categoryRouters from './category.router';
import itemRouters from './item.router';
import orderRouters from './order.router';
import paymentRouters from './payment.router';
import priceRouters from './price.router';
import userRouters from './user.router';

const router: Router = express.Router();

const version = isNumeric(process.env.DB_CLIENT || '1')
  ? parseInt(process.env.DB_CLIENT || '1', 10)
  : 1;

const defaultRouter = `/api/v${version}`;

/**
 * Entities
 */

// Brand
router.use(defaultRouter, brandRouters);

// Category
router.use(defaultRouter, categoryRouters);

// Item
router.use(defaultRouter, itemRouters);

// Order
router.use(defaultRouter, orderRouters);

// Payment
router.use(defaultRouter, paymentRouters);

// Price
router.use(defaultRouter, priceRouters);

// User
router.use(defaultRouter, userRouters);

/**
 * Root
 */

router.get(`${defaultRouter}/`, (req: Request, res: Response) =>
  res.status(200).json({ message: 'Salt Software' })
);

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
