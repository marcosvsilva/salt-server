import express, { Express } from 'express';

import routes from './routes';

/**
 * Express
 */

const app: Express = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use(routes);

export default app;
