import express, { Express } from 'express';
import routes from './routes';

/* Express */

const app: Express = express();

/* Routes */

app.use(routes);

/* Exports */

export default app;
