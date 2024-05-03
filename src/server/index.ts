import {
  MessagesQuerySchema,
  StampsQuerySchema,
  getMessages,
  getStamps,
} from '@/features/database/repository';
import { api } from '@/features/traQ/api';
import { tokenKey, traqAuthRoutes } from './auth';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { StatusCode } from 'hono/utils/http-status';
import { updateMessages } from '@/features/traQ';

const app = new Hono<{
  Variables: { token: string };
}>();

const permittedHosts = [
  /localhost(:\d+)?/,
  /((.+)\.)?trap\.jp/,
  /((.+)\.)?trap\.show/,
  /((.+)\.)?trap\.games/,
  /((.+)\.)?cp20\.dev/,
];

app.use(async (c, next) => {
  const host = c.req.header('host');
  if (host && permittedHosts.some((re) => re.test(host))) {
    const url = new URL(c.req.url);

    c.header('Access-Control-Allow-Origin', url.origin);
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type');
    c.header('Access-Control-Max-Age', '86400');
  }
  return await next();
});

app.use(async (c, next) => {
  if (c.req.path.startsWith('/auth')) {
    return await next();
  }

  const token = getCookie(c, tokenKey);
  if (typeof token !== 'string') {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }

  const url = 'https://q.trap.jp/api/v3/users/me';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    c.status(res.status as StatusCode);
    return c.json({ message: 'Unauthorized' });
  }

  c.set('token', token);
  return await next();
});

app.route('/auth', traqAuthRoutes());

app.get('/me', async (c) => {
  const url = 'https://q.trap.jp/api/v3/users/me';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${c.get('token')}` },
  });

  c.status(res.status as StatusCode);
  return c.json(await res.json());
});

app.get('/subscriptions', async (c) => {
  const token = c.get('token');
  const url = 'https://q.trap.jp/api/v3/users/me/subscriptions';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  c.status(res.status as StatusCode);
  return c.json(await res.json());
});

app.get('/files/:id', async (c) => {
  const id = c.req.param('id');
  const url = `https://q.trap.jp/api/v3/files/${id}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${c.get('token')}` },
  });
  if (!res.ok) {
    return c.status(res.status as StatusCode);
  }

  const data = await res.arrayBuffer();

  c.header(
    'Content-Type',
    res.headers.get('Content-Type') ?? 'application/octet-stream'
  );
  return c.newResponse(data);
});

app.get('/messages', async (c) => {
  const queryStr = c.req.query('query');
  try {
    const query = JSON.parse(queryStr ?? '{}');
    const validated = MessagesQuerySchema.parse(query);

    try {
      const messages = await getMessages(validated);
      return c.json(messages);
    } catch (err) {
      console.error(err);
      c.status(500);
      return c.json({ message: 'Failed to fetch messages' });
    }
  } catch (err) {
    c.status(400);
    return c.json({ message: 'Invalid query' });
  }
});

app.get('/stamps', async (c) => {
  const queryStr = c.req.query('query');
  try {
    const query = JSON.parse(queryStr ?? '{}');
    const validated = StampsQuerySchema.parse(query);

    try {
      const messages = await getStamps(validated);
      return c.json(messages);
    } catch (err) {
      console.error(err);
      c.status(500);
      return c.json({ message: 'Failed to fetch stamps' });
    }
  } catch (err) {
    c.status(400);
    return c.json({ message: 'Invalid query' });
  }
});

app.get('/users', async (c) => {
  try {
    const users = await api.users.getUsers({ 'include-suspended': true });
    if (!users.ok) throw new Error('Failed to fetch users');
    return c.json(users.data);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: 'Failed to fetch users' });
  }
});

app.get('/channels', async (c) => {
  try {
    const channels = await api.channels.getChannels();
    if (!channels.ok) throw new Error('Failed to fetch channels');
    return c.json(channels.data.public);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: 'Failed to fetch channels' });
  }
});

app.get('/message-stamps', async (c) => {
  try {
    const stamps = await api.stamps.getStamps();
    if (!stamps.ok) throw new Error('Failed to fetch stamps');
    return c.json(stamps.data);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: 'Failed to fetch stamps' });
  }
});

let lock = false;
const update = async () => {
  if (lock) {
    console.log('Already updating. Skipping...');
    return;
  }

  console.log('Updating...');

  lock = true;
  await updateMessages();
  lock = false;

  console.log('Finished updating.');
};

setInterval(update, 1000 * 60 * 5);
update();

export default {
  port: 8080,
  fetch: app.fetch,
};
