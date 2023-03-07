import { Repo } from '../repositories/repo.interface';
import { BaseController } from './base.controller';
import { Response, Request } from 'express';

describe('Given BaseController class extended in a TestController', () => {
  type TestType = {
    id: string;
  };
  class TestController extends BaseController<TestType> {}
  const repo: Repo<TestType> = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  const controller = new TestController(repo);

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When getAll is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      await controller.getAll(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next()  if there are errors', async () => {
      (repo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When get is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      await controller.get(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next()  if there are errors', async () => {
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.get(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When search is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      await controller.search(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next()  if there are errors', async () => {
      (repo.search as jest.Mock).mockRejectedValue(new Error());
      await controller.search(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When post is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      await controller.post(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next()  if there are errors', async () => {
      (repo.create as jest.Mock).mockRejectedValue(new Error());
      await controller.post(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When patch is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      req.params.id = '1';
      delete req.body.id;
      await controller.patch(req, resp, next);
      expect(repo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should send json data if there ara NOT errors and the id is in the body', async () => {
      req.body.id = '1';
      delete req.params.id;
      await controller.patch(req, resp, next);
      expect(repo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next()  if there are errors', async () => {
      (repo.update as jest.Mock).mockRejectedValue(new Error());
      await controller.patch(req, resp, next);
      expect(repo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When delete is used', () => {
    test('Then it should send json data if there ara NOT errors', async () => {
      await controller.delete(req, resp, next);
      expect(repo.destroy).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it delete call next()  if there are errors', async () => {
      (repo.destroy as jest.Mock).mockRejectedValue(new Error());
      await controller.delete(req, resp, next);
      expect(repo.destroy).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
