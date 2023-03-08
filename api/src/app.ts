import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { __dirname } from './helpers/files.js';
import { usersRouter } from './routers/users.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';

const debug = createDebug('Social:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

debug({ __dirname });
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/users', usersRouter);

app.use(errorsMiddleware);
