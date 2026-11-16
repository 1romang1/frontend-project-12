import { translateRu } from './translate.js';

// Client-side validation only. The server remains the final authority.
export function validateSignup({ username = '', password = '', confirmPassword = '' }, t = translateRu) {
  const errors = {};
  const normalizedName = username.trim();

  if (!normalizedName) {
    errors.username = t('validation.usernameRequired');
  } else if (normalizedName.length < 3 || normalizedName.length > 20) {
    errors.username = t('validation.usernameLength');
  }

  if (!password) {
    errors.password = t('validation.passwordRequired');
  } else if (password.length < 6) {
    errors.password = t('validation.passwordLength');
  }

  if (!confirmPassword) {
    errors.confirmPassword = t('validation.confirmPasswordRequired');
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t('validation.passwordsMismatch');
  }

  return errors;
}

// Do not send the confirmation field to the API.
export function toSignupCredentials({ username, password }) {
  return { username: username.trim(), password };
}
