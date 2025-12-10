import { zValidator } from '@hono/zod-validator';
import {
  MessageContentsQuerySchema,
  MessagesQuerySchema,
  StampRelationsQuerySchema,
  StampsMeanUsageQuerySchema,
  StampsQuerySchema,
} from '@traq-ing/database';
import { type Context, Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getCaches } from '@/cache';
import { extractWords } from '@/extractor';
import {
  forgotCaches,
  getChannelMessageRankingCached,
  getChannelStampsRankingCached,
  getChannelSubscribers,
  getChannels,
  getFile,
  getGaveMessageStampsRankingCached,
  getMe,
  getMessage,
  getMessageContentsCached,
  getMessageStamps,
  getMessagesCached,
  getMessagesRankingCached,
  getMessagesTimelineCached,
  getOgInfo,
  getReceivedMessageStampsRankingCached,
  getStampRankingCached,
  getStampRelationsCached,
  getStampsCached,
  getStampsMeanUsageCached,
  getSubscriptionRankingCached,
  getSubscriptions,
  getTagRankingCached,
  getUserGroupRankingCached,
  getUserGroups,
  getUsers,
  setSubscriptionLevel,
} from '@/gateway';
import { tokenKey, traqAuthRoutes } from './auth';

const secretKey = process.env.SECRET_KEY;
if (secretKey === undefined) {
  throw new Error('SECRET_KEY is required');
}

const app = new Hono<{
  Variables: { token: string };
}>();

const cacheMiddleware = createMiddleware(async (c, next) => {
  c.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
  await next();
});

const getToken = (c: Context): string | null => {
  const cookieToken = getCookie(c, tokenKey);
  if (typeof cookieToken === 'string') {
    return cookieToken;
  }

  const bearerToken = c.req.header('Authorization');
  if (typeof bearerToken === 'string' && bearerToken.startsWith('Bearer ')) {
    return bearerToken.slice(7);
  }

  return null;
};

const routes = app
  .use(async (c, next) => {
    if (c.req.path.startsWith('/auth')) return await next();

    const token = getToken(c);
    if (token === null) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
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
    c.json(await getMessagesCached(c.req.valid('query')), 200),
  )
  .get(
    '/message-contents',
    zValidator('query', MessageContentsQuerySchema.omit({ offset: true })),
    cacheMiddleware,
    async (c) => {
      const { limit, ...query } = c.req.valid('query');
      const contents = await getMessageContentsCached(query);
      const words = [];
      for (const content of contents) {
        words.push(...(await extractWords(content.content)));
      }
      const wordCountMap = new Map<string, number>();
      for (const word of words) {
        wordCountMap.set(word, (wordCountMap.get(word) ?? 0) + 1);
      }
      const wordCount = [...wordCountMap.entries()].sort((a, b) => b[1] - a[1]);
      return c.json(wordCount.slice(0, limit), 200);
    },
  )
  .get('/channel-messages-ranking', cacheMiddleware, async (c) => c.json(await getChannelMessageRankingCached(), 200))
  .get('/messages-ranking', cacheMiddleware, async (c) => c.json(await getMessagesRankingCached(), 200))
  .get('/messages-timeline', cacheMiddleware, async (c) => c.json(await getMessagesTimelineCached(), 200))
  .get('/stamp-ranking', cacheMiddleware, async (c) => c.json(await getStampRankingCached(), 200))
  .get('/channel-stamps-ranking', cacheMiddleware, async (c) => c.json(await getChannelStampsRankingCached(), 200))
  .get('/gave-stamps-ranking', cacheMiddleware, async (c) => c.json(await getGaveMessageStampsRankingCached(), 200))
  .get('/received-stamps-ranking', cacheMiddleware, async (c) =>
    c.json(await getReceivedMessageStampsRankingCached(), 200),
  )
  .get(
    '/group-ranking',
    zValidator('query', z.object({ groupBy: z.enum(['user', 'group']) })),
    cacheMiddleware,
    async (c) => c.json(await getUserGroupRankingCached(c.req.valid('query').groupBy), 200),
  )
  .get(
    '/tag-ranking',
    zValidator('query', z.object({ groupBy: z.enum(['user', 'tag']) })),
    cacheMiddleware,
    async (c) => c.json(await getTagRankingCached(c.req.valid('query').groupBy), 200),
  )
  .get(
    '/subscription-ranking',
    zValidator('query', z.object({ groupBy: z.enum(['user', 'channel']) })),
    cacheMiddleware,
    async (c) => c.json(await getSubscriptionRankingCached(c.req.valid('query').groupBy), 200),
  )
  .get('/messages/:id', cacheMiddleware, async (c) => c.json(await getMessage(c.req.param('id')), 200))
  .get('/stamps', zValidator('query', StampsQuerySchema), async (c) =>
    c.json(await getStampsCached(c.req.valid('query')), 200),
  )
  .get('/stamps-mean-usage', zValidator('query', StampsMeanUsageQuerySchema), async (c) =>
    c.json(await getStampsMeanUsageCached(c.req.valid('query')), 200),
  )
  .get('/stamp-relations', zValidator('query', StampRelationsQuerySchema), async (c) =>
    c.json(await getStampRelationsCached(c.req.valid('query')), 200),
  )
  .get('/users', cacheMiddleware, async (c) => c.json(await getUsers(), 200))
  .get('/groups', cacheMiddleware, async (c) => c.json(await getUserGroups(), 200))
  .get('/channels', cacheMiddleware, async (c) => c.json(await getChannels(), 200))
  .get('/channels/:id/subscribers', cacheMiddleware, async (c) =>
    c.json(await getChannelSubscribers(c.req.param('id')), 200),
  )
  .get('/message-stamps', cacheMiddleware, async (c) => c.json(await getMessageStamps(), 200))
  .get('/og', zValidator('query', z.object({ url: z.string() })), cacheMiddleware, async (c) => {
    const ogData = await getOgInfo(c.req.valid('query').url);
    if (ogData === null) return c.text('Not Found', 404);
    return c.json(ogData, 200);
  })
  .onError((err) => {
    if (err instanceof HTTPException) return err.getResponse();
    console.error(err);
    throw new HTTPException(500, { message: 'Internal Server Error' });
  })
  .get('/caches', async (c) => {
    if (c.req.header('x-secret-key') !== secretKey) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    return c.json(getCaches(), 200);
  })
  .delete('/caches', async (c) => {
    if (c.req.header('x-secret-key') !== secretKey) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    forgotCaches();
    console.log('Caches cleared');
    return c.status(204);
  });

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

export default {
  port: 8080,
  fetch: app.fetch,
};

export type AppType = typeof routes;
