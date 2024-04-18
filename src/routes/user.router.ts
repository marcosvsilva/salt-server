import express, { Router } from 'express';

import { UserController } from '../controllers';

const router: Router = express.Router();
const userController = new UserController();
const routerUser = '/user';

// GET /api/{version}/user
router.get(routerUser, userController.index);

// GET /api/{version}/user/:uuid
router.get(`${routerUser}/:uuid`, userController.show);

// POST /api/{version}/user
router.post(routerUser, userController.create);

// PUT /api/{version}/user/:uuid
router.put(`${routerUser}/:uuid`, userController.update);

// DELETE /api/{version}/user/:uuid
router.delete(`${routerUser}/:uuid`, userController.delete);

export default router;
