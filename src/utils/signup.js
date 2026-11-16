// Client-side validation only. The server remains the final authority.
export function validateSignup({ username = '', password = '', confirmPassword = '' }) {
  const errors = {};
  const normalizedName = username.trim();

  if (!normalizedName) {
    errors.username = 'Введите имя пользователя';
  } else if (normalizedName.length < 3 || normalizedName.length > 20) {
    errors.username = 'Имя пользователя должно содержать от 3 до 20 символов';
  }

  if (!password) {
    errors.password = 'Введите пароль';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  return errors;
}

// Do not send the confirmation field to the API.
export function toSignupCredentials({ username, password }) {
  return { username: username.trim(), password };
}
