import express, { Router, Request, Response } from 'express';
import * as listsController from '../controllers/lists.controller';
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
