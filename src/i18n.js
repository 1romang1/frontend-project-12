import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';

// All texts are bundled locally; the locale must not depend on browser settings.
const i18n = i18next.createInstance();
i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  supportedLngs: ['ru'],
  resources: { ru: { translation: ru } },
  defaultNS: 'translation',
  initAsync: false,
  interpolation: { escapeValue: false }, // React escapes text content.
});

export default i18n;
