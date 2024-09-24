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
  getStampRanking,
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
  getOgInfo,
  getSubscriptions,
  getUserGroups,
  getUsers,
  setSubscriptionLevel,
} from '@/gateway';
import { HTTPException } from 'hono/http-exception';
import { createMiddleware } from 'hono/factory';

const app = new Hono<{
  Variables: { token: string };
}>();

const cacheMiddleware = createMiddleware(async (c, next) => {
  c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
  await next();
});

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
  .get('/messages', zValidator('query', MessagesQuerySchema), cacheMiddleware, async (c) =>
    c.json(await getMessages(c.req.valid('query')), 200),
  )
  .get('/channel-messages-ranking', cacheMiddleware, async (c) => c.json(await getChannelMessageRanking(), 200))
  .get('/messages-ranking', cacheMiddleware, async (c) => c.json(await getMessagesRanking(), 200))
  .get('/messages-timeline', cacheMiddleware, async (c) => c.json(await getMessagesTimeline(), 200))
  .get('/stamp-ranking', cacheMiddleware, async (c) => c.json(await getStampRanking(), 200))
  .get('/channel-stamps-ranking', cacheMiddleware, async (c) => {
    const data = await getChannelStampsRanking();
    return c.json(data, 200);
  })
  .get('/gave-stamps-ranking', cacheMiddleware, async (c) => {
    const data = await getGaveMessageStampsRanking();
    return c.json(data, 200);
  })
  .get('/received-stamps-ranking', cacheMiddleware, async (c) => {
    const data = await getReceivedMessageStampsRanking();
    return c.json(data, 200);
  })
  .get('/messages/:id', cacheMiddleware, async (c) => {
    const id = c.req.param('id');
    const messages = await api.messages.getMessage(id);
    if (!messages.ok) throw new Error('Failed to fetch messages');
    return c.json(messages.data, 200);
  })
  .get('/stamps', zValidator('query', StampsQuerySchema), async (c) =>
    c.json(await getStamps(c.req.valid('query')), 200),
  )
  .get('/stamp-relations', zValidator('query', StampRelationsQuerySchema), async (c) =>
    c.json(await getStampRelations(c.req.valid('query')), 200),
  )
  .get('/users', cacheMiddleware, async (c) => c.json(await getUsers(), 200))
  .get('/groups', cacheMiddleware, async (c) => c.json(await getUserGroups(), 200))
  .get('/channels', cacheMiddleware, async (c) => c.json(await getChannels(), 200))
  .get('/channels/:id/subscribers', cacheMiddleware, async (c) =>
    c.json(await getChannelSubscribers(c.req.param('id')), 200),
  )
  .get('/message-stamps', cacheMiddleware, async (c) => c.json(await getMessageStamps(), 200))
  .get('/og', zValidator('query', z.object({ url: z.string() })), cacheMiddleware, async (c) =>
    c.json(await getOgInfo(c.req.valid('query').url), 200),
  )
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
  try {
    await updateMessages();
  } catch (err) {
    console.error(err);
  }
  lock = false;

  console.log('Finished updating.');
};

setInterval(update, 1000 * 60 * 60);
if (process.env.NODE_ENV === 'production') {
  update();
}

export default {
  port: 8080,
  fetch: app.fetch,
};

export type AppType = typeof routes;
