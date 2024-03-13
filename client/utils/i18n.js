import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // For browser language detection
import en from '../src/en/translation.json'; // Import English translation
import am from '../src/am/translation.json'; // Import Amharic translation

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // Add language detection
  .init({
    resources: {
      en: {
        translation: en
      },
      am: {
        translation: am
      }
      // Add more languages as needed
    },
    lng: 'en', // Fallback language if detection fails
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'], // Order of language detection methods
      caches: ['localStorage'], // Cache language detected
    },
    interpolation: {
      escapeValue: false // react already safeguards against XSS
    },
    react: {
      useSuspense: false // Set to true if you want to use Suspense for translations loading
    }
  });

export default i18n;
