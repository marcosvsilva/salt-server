import express, { Router } from 'express';

import { CategoryController } from '../controllers';

const router: Router = express.Router();
const categoryController = new CategoryController();
const routerCategory = '/category';

// GET /api/{version}/category
router.get(routerCategory, categoryController.index);

// GET /api/{version}/category/:uuid
router.get(`${routerCategory}/:uuid`, categoryController.show);

// POST /api/{version}/category
router.post(routerCategory, categoryController.create);

// PUT /api/{version}/category/:uuid
router.put(`${routerCategory}/:uuid`, categoryController.update);

// DELETE /api/{version}/category/:uuid
router.delete(`${routerCategory}/:uuid`, categoryController.delete);

export default router;
