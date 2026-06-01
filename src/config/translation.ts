import en from '@assets/localization/en.json';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const translations = {
	en: { ...en },
};
const i18n = new I18n(translations);
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
