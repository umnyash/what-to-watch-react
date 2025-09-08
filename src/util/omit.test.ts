import { omit } from './omit';

describe('Function: omit', () => {
  it('should return a new object without the passed keys', () => {
    const initialObject = {
      avatar: 'photo.jpg',
      email: 'test@test.com',
      isPro: false,
      password: 'abc123',
      token: 'secret',
    };
    const expectedObject = {
      avatar: 'photo.jpg',
      isPro: false,
    };

    const result = omit(initialObject, 'email', 'password', 'token');

    expect(result).toEqual(expectedObject);
  });

  it('should not modify initial object', () => {
    const initialObject = {
      avatar: 'photo.jpg',
      email: 'test@test.com',
      isPro: false,
      password: 'abc123',
      token: 'secret',
    };
    const expectedObject = { ...initialObject };

    omit(initialObject, 'email', 'password', 'token');

    expect(initialObject).toEqual(expectedObject);
  });
});
