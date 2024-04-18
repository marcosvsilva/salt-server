import express, { Router } from 'express';

import { OrderController } from '../controllers';

const router: Router = express.Router();
const orderController = new OrderController();
const routerOrder = '/order';

// GET /api/{version}/order
router.get(routerOrder, orderController.index);

// GET /api/{version}/order/:uuid
router.get(`${routerOrder}/:uuid`, orderController.show);

// POST /api/{version}/order
router.post(routerOrder, orderController.create);

// PUT /api/{version}/order/:uuid
router.put(`${routerOrder}/:uuid`, orderController.update);

// DELETE /api/{version}/order/:uuid
router.delete(`${routerOrder}/:uuid`, orderController.delete);

export default router;
