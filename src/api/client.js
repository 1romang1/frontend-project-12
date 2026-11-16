import i18n from '../i18n.js';
import { censorProfanity } from '../utils/profanity.js';
import { useAuthStore } from '../store/auth.js';

export async function request(method, path, body) {
  const token = useAuthStore.getState().token;
  const response = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || i18n.t('errors.server', { status: response.status }));
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  login: (credentials) => request('POST', '/login', credentials),
  signup: (credentials) => request('POST', '/signup', credentials),
  channels: () => request('GET', '/channels'),
  messages: () => request('GET', '/messages'),
  createChannel: (channel) => request('POST', '/channels', { ...channel, name: censorProfanity(channel.name) }),
  renameChannel: ({ id, name }) => request('PATCH', `/channels/${id}`, { name: censorProfanity(name) }),
  removeChannel: (id) => request('DELETE', `/channels/${id}`),
  sendMessage: (message) => request('POST', '/messages', { ...message, body: censorProfanity(message.body) }),
};
