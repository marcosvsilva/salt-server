import express, { Router } from 'express';

import { ItemController } from '../controllers';

const router: Router = express.Router();
const itemController = new ItemController();
const routerItem = '/item';

// GET /api/{version}/item
router.get(routerItem, itemController.index);

// GET /api/{version}/item/:uuid
router.get(`${routerItem}/:uuid`, itemController.show);

// POST /api/{version}/item
router.post(routerItem, itemController.create);

// PUT /api/{version}/item/:uuid
router.put(`${routerItem}/:uuid`, itemController.update);

// DELETE /api/{version}/item/:uuid
router.delete(`${routerItem}/:uuid`, itemController.delete);

export default router;
