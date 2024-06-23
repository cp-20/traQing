import { Api } from 'traq-bot-ts';

const token = process.env.TRAQ_TOKEN;
if (!token) throw new Error('TRAQ_TOKEN is not set');

export const api = new Api({
  baseApiParams: { headers: { Authorization: `Bearer ${token}` } },
});
