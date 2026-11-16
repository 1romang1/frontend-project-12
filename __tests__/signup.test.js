import { afterEach, describe, expect, test, vi } from 'vitest';
import { validateSignup, toSignupCredentials } from '../src/utils/signup.js';
import { api } from '../src/api/client.js';

const valid = {
  username: 'new_user',
  password: '123456',
  confirmPassword: '123456',
};

describe('signup validation', () => {
  test('accepts a valid registration', () => {
    expect(validateSignup(valid)).toEqual({});
  });

  test('requires all three fields', () => {
    const errors = validateSignup({ username: '', password: '', confirmPassword: '' });
    expect(errors.username).toBeTruthy();
    expect(errors.password).toBeTruthy();
    expect(errors.confirmPassword).toBeTruthy();
  });

  test('enforces username length between 3 and 20 after trimming', () => {
    expect(validateSignup({ ...valid, username: 'ab' }).username).toBeTruthy();
    expect(validateSignup({ ...valid, username: 'x'.repeat(21) }).username).toBeTruthy();
    expect(validateSignup({ ...valid, username: ' abc ' }).username).toBeUndefined();
    expect(validateSignup({ ...valid, username: 'x'.repeat(20) }).username).toBeUndefined();
  });

  test('requires at least 6 password characters', () => {
    expect(validateSignup({ ...valid, password: '12345', confirmPassword: '12345' }).password).toBeTruthy();
  });

  test('requires matching nonempty password confirmation', () => {
    expect(validateSignup({ ...valid, confirmPassword: '' }).confirmPassword).toBeTruthy();
    expect(validateSignup({ ...valid, confirmPassword: 'abcdef' }).confirmPassword).toBeTruthy();
  });

  test('sends only username and password to the server', () => {
    expect(toSignupCredentials({ ...valid, username: ' new_user ' }))
      .toEqual({ username: 'new_user', password: '123456' });
  });
});

describe('signup API errors', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('preserves HTTP 409 so the form can show a duplicate-name error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 409,
      text: async () => JSON.stringify({ message: 'Already registered' }),
    })));

    await expect(api.signup({ username: 'taken', password: '123456' }))
      .rejects.toMatchObject({ status: 409 });
  });
});
