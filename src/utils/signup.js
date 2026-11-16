import i18n from '../i18n.js';

// Client-side validation only. The server remains the final authority.
export function validateSignup({ username = '', password = '', confirmPassword = '' }) {
  const errors = {};
  const normalizedName = username.trim();

  if (!normalizedName) {
    errors.username = i18n.t('validation.usernameRequired');
  } else if (normalizedName.length < 3 || normalizedName.length > 20) {
    errors.username = i18n.t('validation.usernameLength');
  }

  if (!password) {
    errors.password = i18n.t('validation.passwordRequired');
  } else if (password.length < 6) {
    errors.password = i18n.t('validation.passwordLength');
  }

  if (!confirmPassword) {
    errors.confirmPassword = i18n.t('validation.confirmPasswordRequired');
  } else if (password !== confirmPassword) {
    errors.confirmPassword = i18n.t('validation.passwordsMismatch');
  }

  return errors;
}

// Do not send the confirmation field to the API.
export function toSignupCredentials({ username, password }) {
  return { username: username.trim(), password };
}
