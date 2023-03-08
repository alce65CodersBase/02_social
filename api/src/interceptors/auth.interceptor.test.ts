import { Response } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { AuthInterceptor } from './auth.interceptor';
import { Auth } from '../services/auth';
import { RequestPlus } from '../interfaces/request';
import { HTTPError } from '../errors/errors';

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
  } as unknown as RequestPlus;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When logged is used', () => {
    test('Then it should send next if there are NOT Authorization header ', () => {
      (req.get as jest.Mock).mockReturnValue(null);
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization header is BAD formatted', () => {
      (req.get as jest.Mock).mockReturnValue('BAD token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization token is NOT valid', () => {
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue('Invalid token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });
    test('Then it should send next if Authorization token is valid', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer token');
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({});
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });

  describe('When admin is used', () => {
    test('Then it should send next(error) if there are NOT Authorization header ', () => {
      req.info = undefined;
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next(error) if the user role is noT admin', () => {
      req.info = { id: '', email: '', role: 'user' };
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next(error) if the user role is noT admin', () => {
      req.info = { id: '', email: '', role: 'admin' };
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });
});
