import { createContext, useContext } from 'react';
import { censorProfanity } from '../utils/profanity.js';
import { translateRu } from '../utils/translate.js';

export const ApiContext = createContext(null);

export function useApi() {
  const apiClient = useContext(ApiContext);
  if (!apiClient) throw new Error('ApiContext.Provider is missing');
  return apiClient;
}

export async function request(method, path, body, token = null, t = translateRu) {
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
    const error = new Error(data?.message || t('errors.server', { status: response.status }));
    error.status = response.status;
    throw error;
  }
  return data;
}

export function createApiClient(getToken = () => null, t = translateRu) {
  const send = (method, path, body) => request(method, path, body, getToken(), t);
  return {
    login: (credentials) => send('POST', '/login', credentials),
    signup: (credentials) => send('POST', '/signup', credentials),
    channels: () => send('GET', '/channels'),
    messages: () => send('GET', '/messages'),
    createChannel: (channel) => send('POST', '/channels', { ...channel, name: censorProfanity(channel.name) }),
    renameChannel: ({ id, name }) => send('PATCH', `/channels/${id}`, { name: censorProfanity(name) }),
    removeChannel: (id) => send('DELETE', `/channels/${id}`),
    sendMessage: (message) => send('POST', '/messages', { ...message, body: censorProfanity(message.body) }),
  };
}

// Stateless API for standalone helper tests; the app uses its own client from init().
export const api = createApiClient();
