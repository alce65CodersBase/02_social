import { Request, Response } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { AuthInterceptor } from './auth.interceptor';
import { Auth } from '../services/auth';

jest.mock('../services/auth');

describe('Given AuthInterceptor class', () => {
  const repo: Repo<User> = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  const interceptor = new AuthInterceptor(repo);

  const req = {
    body: {},
    params: { id: '' },
    get: jest.fn(),
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When logged is user', () => {
    test('Then it should send next if there are NOT Authorization header ', () => {
      (req.get as jest.Mock).mockReturnValue(null);
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then it should send next if Authorization header is BAD formatted', () => {
      (req.get as jest.Mock).mockReturnValue('BAD token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then it should send next if Authorization token is NOT valid', () => {
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue('Invalid token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then it should send next if Authorization token is valid', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer token');
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({});
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
