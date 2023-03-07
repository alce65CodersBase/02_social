import { Router } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
import { AuthInterceptor } from '../interceptors/auth.interceptor.js';

const debug = createDebug('social:router:users');

// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');

const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor(repo);

usersRouter.get(
  '/',
  interceptor.logged.bind(interceptor),
  controller.getAll.bind(controller)
);
usersRouter.get(
  '/:id',
  interceptor.logged.bind(interceptor),
  controller.get.bind(controller)
);
// Add user
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));

usersRouter.patch(
  '/role/:id:/:role',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.changeRole.bind(controller)
);

// Add friends & enemies management
usersRouter.patch(
  '/add/friend/:id',
  interceptor.logged.bind(interceptor),
  controller.addRelation.bind(controller)
);

usersRouter.patch(
  '/add/enemy/:id',
  interceptor.logged.bind(interceptor),
  controller.addRelation.bind(controller)
);

usersRouter.patch(
  '/delete/friend/:id',
  interceptor.logged.bind(interceptor),
  controller.deleteRelation.bind(controller)
);
usersRouter.patch(
  '/delete/enemy/:id',
  interceptor.logged.bind(interceptor),
  controller.deleteRelation.bind(controller)
);
