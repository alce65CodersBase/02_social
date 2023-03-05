import { Router } from 'express';
import createDebug from 'debug';
// Temp
// import { UsersController } from '../controllers/users.controller.js';
// import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
// import { logged } from '../interceptors/logged.js';
const debug = createDebug('social:router:users');

// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');

// TEMP
// const repo = UsersMongoRepo.getInstance();
// const controller = new UsersController(repo);

usersRouter.get('/', () => {
  // Controller
});
usersRouter.post('/register', () => {
  // // Controller
});
usersRouter.post('/login', () => {
  // // Controller
});

// TEMP
// usersRouter.get('/', controller.getAll.bind(controller));
// usersRouter.post('/register', controller.register.bind(controller));
// usersRouter.post('/login', controller.login.bind(controller));
// Add favorites management
// usersRouter.patch('/addfav/:id', controller.addFav.bind(controller));
// usersRouter.patch('/changefav/:id', controller.changeFav.bind(controller));
// usersRouter.patch('/deletefav/:id', controller.deleteFav.bind(controller));
