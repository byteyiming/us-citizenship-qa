import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const l = locale ?? 'en';
  const activeLocale: 'en'|'es'|'zh' = l === 'en' || l === 'es' || l === 'zh' ? l : 'en';
  const messages = (await import(`../messages/${activeLocale}.json`)).default;
  return { locale: activeLocale, messages };
});


