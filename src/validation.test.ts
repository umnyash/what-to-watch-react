import { validationErrorMessages, getValidationErrorMessage } from './validation';

describe('Function: getValidationErrorMessage', () => {
  describe('email validation', () => {
    it('returns required error for empty email', () => {
      const email = '';
      const result = getValidationErrorMessage('email', email);
      expect(result).toBe(validationErrorMessages.email.required);
    });

    it.each([
      'u',
      'u@',
      'u@m',
      'u@m.',
      'u@m.n',
      'um.ni',
      'umni',
      '@um.ni',
    ])('returns pattern error for invalid email: %s', (email) => {
      const result = getValidationErrorMessage('email', email);
      expect(result).toBe(validationErrorMessages.email.pattern);
    });

    it.each([
      'u@m.ni',
      'u-mn@ya.sh',
      'um_n@ya.sh',
      'u.m@n.ya.sh'
    ])('returns null for valid email', (email) => {
      const result = getValidationErrorMessage('email', email);
      expect(result).toBeNull();
    });
  });

  describe('password validation', () => {
    it('returns required error for empty password', () => {
      const password = '';
      const result = getValidationErrorMessage('password', password);
      expect(result).toBe(validationErrorMessages.password.required);
    });

    it.each([
      'a',
      'ab',
      '1',
      '12',
    ])('returns pattern error for password without both letters and numbers: %s', (password) => {
      const result = getValidationErrorMessage('password', password);
      expect(result).toBe(validationErrorMessages.password.pattern);
    });

    it.each([
      'a1',
      '1a',
    ])('returns null for valid password: %s', (password) => {
      const result = getValidationErrorMessage('password', password);
      expect(result).toBeNull();
    });
  });
});
