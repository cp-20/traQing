import { updateMessages } from '@/traQ';
import { api } from '@/traQ/api';
import { zValidator } from '@hono/zod-validator';
import {
  MessagesQuerySchema,
  StampRelationsQuerySchema,
  StampsQuerySchema,
  getGaveMessageStampsRanking,
  getMessages,
  getMessagesRanking,
  getMessagesTimeline,
  getReceivedMessageStampsRanking,
  getStampRelations,
  getStamps,
} from '@traq-ing/database';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { z } from 'zod';
import { tokenKey, traqAuthRoutes } from './auth';

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
    const data = (await res.json()) as { channelId: string; level: number }[];

    return c.json(data, 200);
  })
  .put('/subscriptions/:id', zValidator('json', z.object({ level: z.number().int() })), async (c) => {
    const token = c.get('token');
    const id = c.req.param('id');
    const json = c.req.valid('json');
    const url = `https://q.trap.jp/api/v3/users/me/subscriptions/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (!res.ok) {
      return c.json({ message: 'Failed to update subscription' }, 500);
    }

    return c.json(await res.json(), 200);
  })
  .get('/messages', zValidator('query', MessagesQuerySchema), async (c) => {
    const query = c.req.valid('query');

    try {
      const messages = await getMessages(query);
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/messages-ranking', async (c) => {
    try {
      const messages = await getMessagesRanking();
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/messages-timeline', async (c) => {
    try {
      const messages = await getMessagesTimeline();
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/gave-stamps-ranking', async (c) => {
    try {
      const messages = await getGaveMessageStampsRanking();
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch messages' }, 500);
    }
  })
  .get('/received-stamps-ranking', async (c) => {
    try {
      const messages = await getReceivedMessageStampsRanking();
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
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
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
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
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
      return c.json(messages, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch stamps' }, 500);
    }
  })
  .get('/stamp-relations', zValidator('query', StampRelationsQuerySchema), async (c) => {
    const query = c.req.valid('query');
    try {
      const messages = await getStampRelations(query);
      c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
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
  .get('/groups', async (c) => {
    try {
      const userGroups = await api.groups.getUserGroups();
      if (!userGroups.ok) throw new Error('Failed to fetch user groups');
      return c.json(userGroups.data, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch user groups' }, 500);
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
  })
  .get('/og', zValidator('query', z.object({ url: z.string() })), async (c) => {
    const { url } = c.req.valid('query');
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'bot' } });
      if (!res.ok) throw new Error('Failed to fetch og');
      const data = await res.text();
      const metaTags = data.match(/<meta [^>]+>/g) ?? [];
      const parsedMetaTags = metaTags.map((tag) => {
        const properties = tag.matchAll(/([a-z]+)="([^"]+)"/g);
        const props = Array.from(properties).map((prop) => [prop[1], prop[2]] as const);
        const propMap = Object.fromEntries(props);
        return propMap;
      });

      const title = parsedMetaTags.find((tag) => tag.property === 'og:title')?.content;
      const description = parsedMetaTags.find((tag) => tag.property === 'og:description')?.content;
      const image = parsedMetaTags.find((tag) => tag.property === 'og:image')?.content;
      const origin = new URL(url).host;
      const type = ['twitter.com', 'x.com'].includes(origin) ? ('summary' as const) : ('article' as const);

      return c.json({ title, description, image, origin, type }, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: 'Failed to fetch og' }, 500);
    }
  });

app.on('GET', ['/files/:id', '/v3/files/:id'], async (c) => {
  const id = c.req.param('id');
  const url = `https://q.trap.jp/api/v3/files/${id}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${c.get('token')}`,
      ...c.req.raw.headers,
    },
  });
  if (!res.ok) {
    return c.json({ message: 'Failed to fetch file' }, 500);
  }

  const data = await res.arrayBuffer();

  c.header('Content-Type', res.headers.get('Content-Type') ?? 'application/octet-stream');
  c.header('Cache-Control', res.headers.get('Cache-Control') ?? 'public, max-age=31536000');
  return c.newResponse(data);
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
