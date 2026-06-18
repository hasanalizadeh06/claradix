import { getRequestConfig } from 'next-intl/server';
import enMessages from './messages/en.json';
import azMessages from './messages/az.json';
import ruMessages from './messages/ru.json';

const messages = { en: enMessages, az: azMessages, ru: ruMessages };

export default getRequestConfig(async ({ locale }) => ({
  locale: (locale as keyof typeof messages) ?? 'en',
  messages: messages[(locale as keyof typeof messages) ?? 'en'],
}));
