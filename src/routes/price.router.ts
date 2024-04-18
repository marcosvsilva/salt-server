import express, { Router } from 'express';

import { PriceController } from '../controllers';

const router: Router = express.Router();
const priceController = new PriceController();
const routerPrice = '/price';

// GET /api/{version}/price
router.get(routerPrice, priceController.index);

// GET /api/{version}/price/:uuid
router.get(`${routerPrice}/:uuid`, priceController.show);

// POST /api/{version}/price
router.post(routerPrice, priceController.create);

// PUT /api/{version}/price/:uuid
router.put(`${routerPrice}/:uuid`, priceController.update);

// DELETE /api/{version}/price/:uuid
router.delete(`${routerPrice}/:uuid`, priceController.delete);

export default router;
