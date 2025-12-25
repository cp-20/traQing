import { dropMessagesAndStamps, updateMessages } from '@/traQ';

const baseUrl = process.env.SERVER_URL;
if (!baseUrl) throw new Error('SERVER_URL is not set');
const secret = process.env.SECRET_KEY;
if (!secret) throw new Error('SECRET_KEY is not set');

// await dropMessagesAndStamps();
await updateMessages(true);
await fetch(`${baseUrl}/caches`, { method: 'DELETE', headers: { 'X-Secret-Key': secret } });
