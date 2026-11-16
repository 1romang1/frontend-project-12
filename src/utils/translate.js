import ru from '../locales/ru.json';

// Pure fallback for validators and the HTTP helper outside a React tree.
export function translateRu(key, options = {}) {
  const value = key.split('.').reduce((node, segment) => node?.[segment], ru);
  if (typeof value !== 'string') return key;
  return value.replace(/\{\{(\w+)\}\}/g, (match, name) => options[name] ?? match);
}
