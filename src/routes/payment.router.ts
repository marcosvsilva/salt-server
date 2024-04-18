import express, { Router } from 'express';

import { PaymentController } from '../controllers';

const router: Router = express.Router();
const paymentController = new PaymentController();
const routerPayment = '/payment';

// GET /api/{version}/payment
router.get(routerPayment, paymentController.index);

// GET /api/{version}/payment/:uuid
router.get(`${routerPayment}/:uuid`, paymentController.show);

// POST /api/{version}/payment
router.post(routerPayment, paymentController.create);

// PUT /api/{version}/payment/:uuid
router.put(`${routerPayment}/:uuid`, paymentController.update);

// DELETE /api/{version}/payment/:uuid
router.delete(`${routerPayment}/:uuid`, paymentController.delete);

export default router;
