import express, { Router } from 'express';

import { BrandController } from '../controllers';

const router: Router = express.Router();
const brandController = new BrandController();
const routerBrand = '/brand';

// GET /api/{version}/brand
router.get(routerBrand, brandController.index);

// GET /api/{version}/brand/:uuid
router.get(`${routerBrand}/:uuid`, brandController.show);

// POST /api/{version}/brand
router.post(routerBrand, brandController.create);

// PUT /api/{version}/brand/:uuid
router.put(`${routerBrand}/:uuid`, brandController.update);

// DELETE /api/{version}/brand/:uuid
router.delete(`${routerBrand}/:uuid`, brandController.delete);

export default router;
