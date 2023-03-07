import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';
import { BaseController } from './base.controller.js';
import { PayloadToken } from '../interfaces/token';
const debug = createDebug('Social:controller:users');
export class UsersController extends BaseController<User> {
  constructor(public repo: Repo<User>) {
    super(repo);
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: Request, resp: Response, next: NextFunction) {
    debug('add/friends:patch');
    resp.json({
      results: [],
    });
  }

  async deleteFriend(req: Request, resp: Response, next: NextFunction) {
    debug('delete/friends:patch');
    resp.json({
      results: [],
    });
  }

  addEnemy(req: Request, resp: Response, next: NextFunction) {
    debug('add/enemy:patch');
    resp.json({
      results: [],
    });
  }

  deleteEnemy(req: Request, resp: Response, next: NextFunction) {
    debug('delete/enemy:patch');
    resp.json({
      results: [],
    });
  }
}
