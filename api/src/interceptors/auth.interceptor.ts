import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { RequestPlus } from '../interfaces/request';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('w6:interceptor');

export class AuthInterceptor {
  constructor(public repoUsers: Repo<User>) {
    debug('Instantiate');
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.verifyJWTGettingPayload(token);
      req.info = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  admin(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info)
        throw new HTTPError(401, 'Not autorithed', 'Not info about user');
      if (req.info.role !== 'admin')
        throw new HTTPError(401, 'Not autorithed', 'Not admin role');
      next();
    } catch (error) {
      next(error);
    }
  }
}
