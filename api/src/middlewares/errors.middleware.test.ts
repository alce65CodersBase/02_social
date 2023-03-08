import { Request, Response } from 'express';
import { errorsMiddleware } from './errors.middleware';
import { Error as MongooseError } from 'mongoose';
import { HTTPError } from '../errors/errors';

describe('Given errorsMiddleware', () => {
  const req = {} as Request;
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When the error is a mongoose Cast Error', () => {
    test('Then status should be 400', () => {
      // Arrange
      const error = new MongooseError.CastError('', '', '');
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenLastCalledWith(400);
    });
  });

  describe('When the error is a mongoose Validation Error', () => {
    test('Then status should be 406', () => {
      // Arrange
      const error = new MongooseError.ValidationError();
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenLastCalledWith(406);
    });
  });

  describe('When the error is a custom HTTPError', () => {
    test('Then status should HTTPError status', () => {
      // Arrange
      const errorStatus = 418;
      const error = new HTTPError(errorStatus, 'Tee', 'Pot');
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenLastCalledWith(errorStatus);
    });
  });

  describe('When the error is any other Error', () => {
    test('Then status should be 500', () => {
      // Arrange
      const error = new Error('Tee Pot');
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenLastCalledWith(500);
    });
  });
});
