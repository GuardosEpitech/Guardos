import i18n from 'i18next';
import detector from "i18next-browser-languagedetector";
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import de from './de.json';
import fr from './fr.json';

const resources = {
  en: en,
  de: de,
  fr: fr
};

i18n
  // pass the i18n instance to react-i18next.
  .use(detector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en',// default language to use.
    fallbackLng: 'en'
  });

export default {i18n};
