import {
  MessagesQuerySchema,
  StampsQuerySchema,
  getMessages,
  getStamps,
} from '@traq-ing/database';
import { api } from '@/traQ/api';
import { tokenKey, traqAuthRoutes } from './auth';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { StatusCode } from 'hono/utils/http-status';
import { updateMessages } from '@/traQ';
import { zValidator } from '@hono/zod-validator';

const app = new Hono<{
  Variables: { token: string };
}>();

const routes = app
  .use(async (c, next) => {
    if (c.req.path.startsWith('/auth')) {
      return await next();
    }

    const token = getCookie(c, tokenKey);
    if (typeof token !== 'string') {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const url = 'https://q.trap.jp/api/v3/users/me';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    c.set('token', token);
    return await next();
  })
  .route('/auth', traqAuthRoutes())
  .get('/me', async (c) => {
    const url = 'https://q.trap.jp/api/v3/users/me';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${c.get('token')}` },
    });
    if (!res.ok) {
      return c.json({ message: 'Failed to fetch user' }, 500);
    }
    return c.json(await res.json(), 200);
  })
  .get('/subscriptions', async (c) => {
    const token = c.get('token');
    const url = 'https://q.trap.jp/api/v3/users/me/subscriptions';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return c.json({ message: 'Failed to fetch subscriptions' }, 500);
    }

    return c.json(await res.json(), 200);
  })
  .get('/files/:id', async (c) => {
    const id = c.req.param('id');
    const url = `https://q.trap.jp/api/v3/files/${id}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${c.get('token')}`,
        ...c.req.raw.headers,
      },
    });
    if (!res.ok) {
      return c.status(res.status as StatusCode);
    }

    const data = await res.arrayBuffer();

    c.header(
      'Content-Type',
      res.headers.get('Content-Type') ?? 'application/octet-stream'
    );
    c.header(
      'Cache-Control',
      res.headers.get('Cache-Control') ?? 'public, max-age=31536000'
    );
    return c.newResponse(data);
  })
  .get('/messages', zValidator('query', MessagesQuerySchema), async (c) => {
    const query = c.req.valid('query');

    try {
      const messages = await getMessages(query);
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/messages/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const messages = await api.messages.getMessage(id);
      if (!messages.ok) throw new Error('Failed to fetch messages');
      return c.json(messages.data, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/stamps', zValidator('query', StampsQuerySchema), async (c) => {
    const query = c.req.valid('query');
    try {
      const messages = await getStamps(query);
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch stamps' }, 500);
    }
  })
  .get('/users', async (c) => {
    try {
      const users = await api.users.getUsers({ 'include-suspended': true });
      if (!users.ok) throw new Error('Failed to fetch users');
      return c.json(users.data, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch users' }, 500);
    }
  })
  .get('/channels', async (c) => {
    try {
      const channels = await api.channels.getChannels();
      if (!channels.ok) throw new Error('Failed to fetch channels');
      return c.json(channels.data.public, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch channels' }, 500);
    }
  })
  .get('/message-stamps', async (c) => {
    try {
      const stamps = await api.stamps.getStamps();
      if (!stamps.ok) throw new Error('Failed to fetch stamps');
      return c.json(stamps.data, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch stamps' }, 500);
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

export type AppType = typeof routes;
