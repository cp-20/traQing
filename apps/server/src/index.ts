import { updateMessages } from '@/traQ';
import { api } from '@/traQ/api';
import { zValidator } from '@hono/zod-validator';
import {
  MessagesQuerySchema,
  StampRelationsQuerySchema,
  StampsQuerySchema,
  getChannelMessageRanking,
  getChannelStampsRanking,
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
import {
  getChannels,
  getChannelSubscribers,
  getFile,
  getMe,
  getMessageStamps,
  getSubscriptions,
  getUserGroups,
  getUsers,
  setSubscriptionLevel,
} from '@/gateway';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<{
  Variables: { token: string };
}>();

const routes = app
  .use(async (c, next) => {
    if (c.req.path.startsWith('/auth')) return await next();

    const token = getCookie(c, tokenKey);
    if (typeof token !== 'string') throw new HTTPException(401, { message: 'Unauthorized' });
    await getMe(token);

    c.set('token', token);
    return await next();
  })
  .route('/auth', traqAuthRoutes())
  .get('/me', async (c) => {
    const data = await getMe(c.get('token'));
    return c.json(data, 200);
  })
  .get('/subscriptions', async (c) => {
    const token = c.get('token');
    const data = await getSubscriptions(token);
    return c.json(data, 200);
  })
  .put(
    '/subscriptions/:id',
    zValidator('json', z.object({ level: z.union([z.literal(0), z.literal(1), z.literal(2)]) })),
    async (c) => {
      const token = c.get('token');
      const channelId = c.req.param('id');
      const level = c.req.valid('json').level;
      await setSubscriptionLevel(token, channelId, level);
      return c.status(200);
    },
  )
  .get('/messages', zValidator('query', MessagesQuerySchema), async (c) => {
    const query = c.req.valid('query');
    const messages = await getMessages(query);
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(messages, 200);
  })
  .get('/channel-messages-ranking', async (c) => {
    const data = await getChannelMessageRanking();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/messages-ranking', async (c) => {
    const data = await getMessagesRanking();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/messages-timeline', async (c) => {
    const data = await getMessagesTimeline();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/channel-stamps-ranking', async (c) => {
    const data = await getChannelStampsRanking();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/gave-stamps-ranking', async (c) => {
    const data = await getGaveMessageStampsRanking();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/received-stamps-ranking', async (c) => {
    const data = await getReceivedMessageStampsRanking();
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/messages/:id', async (c) => {
    const id = c.req.param('id');
    const messages = await api.messages.getMessage(id);
    if (!messages.ok) throw new Error('Failed to fetch messages');
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(messages.data, 200);
  })
  .get('/stamps', zValidator('query', StampsQuerySchema), async (c) => {
    const query = c.req.valid('query');
    const data = await getStamps(query);
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/stamp-relations', zValidator('query', StampRelationsQuerySchema), async (c) => {
    const query = c.req.valid('query');
    const data = await getStampRelations(query);
    c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    return c.json(data, 200);
  })
  .get('/users', async (c) => c.json(await getUsers(), 200))
  .get('/groups', async (c) => c.json(await getUserGroups(), 200))
  .get('/channels', async (c) => c.json(await getChannels(), 200))
  .get('/channels/:id/subscribers', async (c) => c.json(await getChannelSubscribers(c.req.param('id')), 200))
  .get('/message-stamps', async (c) => c.json(await getMessageStamps(), 200))
  .get('/og', zValidator('query', z.object({ url: z.string() })), async (c) => {
    const { url } = c.req.valid('query');
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
  })
  .onError((err) => {
    if (err instanceof HTTPException) return err.getResponse();
    console.error(err);
    throw new HTTPException(500, { message: 'Internal Server Error' });
  })
  .get(
    '/avatars/:id',
    zValidator('query', z.object({ width: z.coerce.number().optional(), height: z.coerce.number().optional() })),
    async (c) => {
      const userId = c.req.param('id');
      const width = c.req.valid('query').width ?? c.req.valid('query').height;
      const height = c.req.valid('query').height ?? c.req.valid('query').width;
      const users = await getUsers();
      const fileId = users.find((user) => user.id === userId)?.iconFileId;
      if (!fileId) throw new HTTPException(404, { message: 'User not found' });
      const file = await getFile(fileId, width, height);
      c.header('Content-Type', file.type);
      c.header('Cache-Control', 'private, max-age=31536000');
      return c.newResponse(file.stream());
    },
  );

app.on(
  'GET',
  ['/files/:id', '/v3/files/:id'],
  zValidator('query', z.object({ width: z.coerce.number().optional(), height: z.coerce.number().optional() })),
  async (c) => {
    const fileId = c.req.param('id');
    const width = c.req.valid('query').width ?? c.req.valid('query').height;
    const height = c.req.valid('query').height ?? c.req.valid('query').width;
    const file = await getFile(fileId, width, height);
    c.header('Content-Type', file.type);
    c.header('Cache-Control', 'private, max-age=31536000');
    return c.newResponse(file.stream());
  },
);

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
