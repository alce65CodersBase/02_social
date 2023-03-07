import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';
import { BaseController } from './base.controller.js';
import { PayloadToken } from '../interfaces/token';
import { RequestPlus } from '../interfaces/request';
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
        results: [data[0]],
      });
    } catch (error) {
      next(error);
    }
  }

  async addRelation(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug(`${req.url}:patch`);
      const target = req.url.split('/')[1];
      const newRelation: User = await this.checkNewItem(req);
      const actualUser: { [key: string]: string | User[] } =
        await this.repo.queryId(req.info?.id as string);
      if (
        (actualUser[target] as User[]).find(
          (item) => item.id === newRelation.id
        )
      ) {
        throw new HTTPError(401, 'Invalid', 'New item still present');
      }

      (actualUser[target] as User[]).push();
      await this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRelation(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug(`${req.url}:patch`);
      const target = req.url.split('/')[1];
      const removeRelation: User = await this.checkNewItem(req);
      const actualUser: { [key: string]: string | User[] } =
        await this.repo.queryId(req.info?.id as string);
      const itemIndex = (actualUser[target] as User[]).findIndex(
        (item) => item.id === removeRelation.id
      );
      if (itemIndex < 0) {
        throw new HTTPError(401, 'Invalid', 'Item to remove NOT present');
      }

      (actualUser[target] as User[]).splice(itemIndex, 1);
      await this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async changeRole(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.role)
        throw new HTTPError(
          400,
          'Bad request',
          'Not valid id or role in the url'
        );
      const user = await this.repo.queryId(req.params.id);
      user.role = req.params.role;
      const actualUser = await this.repo.update(user);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  private async checkNewItem(req: RequestPlus) {
    const newFriend: User = req.body;
    if (!newFriend || !newFriend.id) {
      throw new HTTPError(
        401,
        'Bad request',
        'Invalid user data in the request'
      );
    }

    await this.repo.queryId(newFriend.id);
    if (!req.info?.id) {
      throw new HTTPError(401, 'Not authorized', 'Invalid data in the token');
    }

    return newFriend;
  }
}
