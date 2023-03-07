import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PayloadToken } from '../interfaces/token';
import { Auth } from './auth';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given Auth class', () => {
  describe('When method createJWT is called', () => {
    test('Then function sign from jwt should been called', () => {
      const payload = {} as PayloadToken;
      Auth.createJWT(payload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When method verifyJWTGettingPayload is called', () => {
    test('Then function verify from jwt should been called if token is valid', () => {
      (jwt.verify as jest.Mock).mockReturnValue({});
      Auth.verifyJWTGettingPayload('token');
      expect(jwt.verify).toHaveBeenCalled();
    });

    test('Then a error should been throw if token is NOT valid', () => {
      (jwt.verify as jest.Mock).mockReturnValue('invalid token');
      expect(() => Auth.verifyJWTGettingPayload('token')).toThrow();
    });
  });

  describe('When method hash is called', () => {
    test('Then function hash from bcrypt should been called', async () => {
      await Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When method compare is called', () => {
    test('Then function compare from bcrypt should been called', async () => {
      await Auth.compare('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
