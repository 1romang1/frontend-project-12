import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';

export function createI18n() {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    lng: 'ru',
    fallbackLng: 'ru',
    supportedLngs: ['ru'],
    resources: { ru: { translation: ru } },
    defaultNS: 'translation',
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  return i18n;
}
