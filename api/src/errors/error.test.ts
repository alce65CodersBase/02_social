import { CustomError, HTTPError } from './errors.js';

describe('Given', () => {
  let error: CustomError;
  beforeEach(() => {
    error = new HTTPError(418, 'Tea Pot', 'Ja, ja, ja');
  });
  test('should first', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HTTPError);
    expect(error).toHaveProperty('statusCode', 418);
    expect(error).toHaveProperty('statusMessage', 'Tea Pot');
    expect(error).toHaveProperty('message', 'Ja, ja, ja');
    expect(error).toHaveProperty('name', 'HTTPError');
  });
});
