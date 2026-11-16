import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import profanity from 'leo-profanity';
import { api } from '../src/api/client.js';
import { censorProfanity } from '../src/utils/profanity.js';

const dictionaryWord = (language, pattern) =>
  profanity.getDictionary(language).find((word) => pattern.test(word));

const englishWord = dictionaryWord('en', /^[a-z]{4,}$/i);
const russianWord = dictionaryWord('ru', /^[а-яё]{4,}$/i);

describe('profanity filter', () => {
  test('includes both English and Russian dictionaries', () => {
    expect(englishWord).toBeTruthy();
    expect(russianWord).toBeTruthy();
    expect(profanity.check(englishWord)).toBe(true);
    expect(profanity.check(russianWord)).toBe(true);
  });

  test('masks English profanity without removing surrounding text', () => {
    const result = censorProfanity(`Hello ${englishWord} friend`);
    expect(result).toMatch(/Hello/);
    expect(result).toMatch(/friend/);
    expect(result).toContain('*');
    expect(result.toLowerCase()).not.toContain(englishWord.toLowerCase());
  });

  test('masks Russian profanity', () => {
    const result = censorProfanity(`Привет ${russianWord} друг`);
    expect(result).toContain('Привет');
    expect(result).toContain('*');
    expect(result.toLowerCase()).not.toContain(russianWord.toLowerCase());
  });

  test('does not change innocent messages', () => {
    expect(censorProfanity('Привет, как дела?')).toBe('Привет, как дела?');
  });
});

describe('API sends filtered text to the server', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => '{}',
    })));
  });

  afterEach(() => vi.unstubAllGlobals());

  const lastPayload = () => JSON.parse(fetch.mock.calls.at(-1)[1].body);

  test('filters chat messages before POST /messages', async () => {
    await api.sendMessage({ body: `hello ${englishWord}`, channelId: '1', username: 'Alice' });
    const payload = lastPayload();
    expect(payload.channelId).toBe('1');
    expect(payload.username).toBe('Alice');
    expect(payload.body).toContain('*');
    expect(payload.body).not.toContain(englishWord);
  });

  test('filters new channel names before POST /channels', async () => {
    await api.createChannel({ name: `Test ${russianWord}` });
    const payload = lastPayload();
    expect(payload.name).toContain('*');
    expect(payload.name.toLowerCase()).not.toContain(russianWord.toLowerCase());
  });

  test('filters renamed channels before PATCH /channels/:id', async () => {
    await api.renameChannel({ id: '2', name: `Test ${englishWord}` });
    const payload = lastPayload();
    expect(fetch.mock.calls.at(-1)[0]).toBe('/api/v1/channels/2');
    expect(payload.name).toContain('*');
    expect(payload.name.toLowerCase()).not.toContain(englishWord.toLowerCase());
  });
});
