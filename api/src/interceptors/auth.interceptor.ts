import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { RequestPlus } from '../interfaces/request';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../errors/errors';
import { Auth } from '../services/auth';

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
}
