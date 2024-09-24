import { Api } from 'traq-bot-ts';

if (!process.env.TRAQ_TOKEN) throw new Error('TRAQ_TOKEN is not set');
export const machineToken = process.env.TRAQ_TOKEN;

export const api = new Api({
  baseApiParams: { headers: { Authorization: `Bearer ${machineToken}` } },
});
