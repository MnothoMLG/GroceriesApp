import i18n from '@config/translation';

type TranslationReplacements =
  | Array<string | number | undefined>
  | Record<string, string | number | undefined>;

const interpolate = (
  value: string,
  replacements?: TranslationReplacements,
): string => {
  if (!replacements) {
    return value;
  }

  if (Array.isArray(replacements)) {
    let message = value;

    replacements.forEach((replacement, index) => {
      message = message.replace(
        new RegExp(`\\{${index}\\}`, 'g'),
        String(replacement ?? ''),
      );
    });

    return message;
  }

  return Object.entries(replacements).reduce((message, [key, replacement]) => {
    return message.replace(
      new RegExp(`\\{${key}\\}`, 'g'),
      String(replacement ?? ''),
    );
  }, value);
};

export const useTranslation = () => {
  const t = (name: string, replacements?: TranslationReplacements) =>
    interpolate(i18n.t(name), replacements);

  return {
    t,
  };
};
