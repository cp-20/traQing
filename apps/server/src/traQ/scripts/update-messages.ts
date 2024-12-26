import { updateMessages } from '..';

const baseUrl = process.env.SERVER_URL;
if (!baseUrl) throw new Error('SERVER_URL is not set');
const secret = process.env.SECRET_KEY;
if (!secret) throw new Error('SECRET_KEY is not set');

await updateMessages(false);
await fetch(`${baseUrl}/caches`, { method: 'DELETE', headers: { 'X-Secret-Key': secret } });
