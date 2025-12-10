import {
  getChannelMessageRanking,
  getChannelStampsRanking,
  getGaveMessageStampsRanking,
  getMessageContents,
  getMessages,
  getMessagesRanking,
  getMessagesTimeline,
  getReceivedMessageStampsRanking,
  getStampRanking,
  getStampRelations,
  getStamps,
  getStampsMeanUsage,
  getSubscriptionRanking,
  getTagRanking,
  getUserGroupRanking,
} from '@traq-ing/database';
import sharp from 'sharp';
import { memorize, memorizeWithKey, purgeCache } from '@/cache';
import { api, machineToken } from '@/traQ/api';

const getAuthHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getMe = memorize(10, async (token: string) => {
  const res = await api.users.getMe(getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.data;
});

export const getSubscriptions = memorize(0, async (token: string) => {
  const res = await api.users.getMyChannelSubscriptions(getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.data;
});

export const setSubscriptionLevel = async (token: string, channelId: string, level: number) => {
  const res = await api.users.setChannelSubscribeLevel(channelId, { level }, getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to update subscription');
  return res.data;
};

export const getMessage = memorize(3600, async (messageId: string) => {
  const res = await api.messages.getMessage(messageId);
  if (!res.ok) throw new Error('Failed to fetch message');
  return res.data;
});

export const getUsers = memorize(3600, async () => {
  const res = await api.users.getUsers({ 'include-suspended': true });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.data;
});

export const getUserGroups = memorize(0, async () => {
  const res = await api.groups.getUserGroups();
  if (!res.ok) throw new Error('Failed to fetch user groups');
  return res.data;
});

export const getChannelSubscribers = memorize(0, async (channelId: string) => {
  const res = await api.channels.getChannelSubscribers(channelId);
  if (!res.ok) throw new Error('Failed to fetch channel');
  return res.data;
});

export const getChannels = memorize(0, async () => {
  const res = await api.channels.getChannels();
  if (!res.ok) throw new Error('Failed to fetch channels');
  return res.data.public;
});

export const getMessageStamps = memorize(0, async () => {
  const res = await api.stamps.getStamps();
  if (!res.ok) throw new Error('Failed to fetch stamps');
  return res.data;
});

const imageDir = './images';
const imageTypes: (string | null)[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const getFile = memorize(
  0,
  async (fileId: string, width: number | undefined, height: number | undefined): Promise<Blob> => {
    const filename =
      width !== undefined && height !== undefined ? `${fileId}_${width}x${height}.webp` : `${fileId}.webp`;
    const file = Bun.file(`${imageDir}/${filename}`);
    if (await file.exists()) {
      return new File([Buffer.from(await file.arrayBuffer())], fileId, { type: 'image/webp' });
    }

    const res = await fetch(`${api.baseUrl}/files/${fileId}`, getAuthHeader(machineToken));
    if (!res.ok) throw new Error('Failed to fetch file');
    if (!imageTypes.includes(res.headers.get('Content-Type'))) return await res.blob();

    const data = await res.arrayBuffer();
    const compressed = await sharp(Buffer.from(data)).webp({ effort: 6, quality: 80 }).resize(width, height).toBuffer();
    Bun.write(`${imageDir}/${filename}`, compressed);

    return new File([compressed], fileId, { type: 'image/webp' });
  },
);

export const getOgInfo = memorize(0, async (url: string) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'bot' } });
  if (!res.ok) return null;
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

  return { title, description, image, origin, type };
});

export const getMessagesCached = memorizeWithKey(3600, 'messages', getMessages);
export const getMessageContentsCached = memorizeWithKey(3600, 'messageContents', getMessageContents);
export const getChannelMessageRankingCached = memorizeWithKey(3600, 'channelMessageRanking', getChannelMessageRanking);
export const getMessagesRankingCached = memorizeWithKey(3600, 'messagesRanking', getMessagesRanking);
export const getMessagesTimelineCached = memorizeWithKey(3600, 'messagesTimeline', getMessagesTimeline);
export const getStampRankingCached = memorizeWithKey(3600, 'stampRanking', getStampRanking);
export const getChannelStampsRankingCached = memorizeWithKey(3600, 'channelStampsRanking', getChannelStampsRanking);
export const getGaveMessageStampsRankingCached = memorizeWithKey(
  3600,
  'gaveMessageStampsRanking',
  getGaveMessageStampsRanking,
);
export const getReceivedMessageStampsRankingCached = memorizeWithKey(
  3600,
  'receivedMessageStampsRanking',
  getReceivedMessageStampsRanking,
);
export const getUserGroupRankingCached = memorizeWithKey(3600, 'userGroupRanking', getUserGroupRanking);
export const getTagRankingCached = memorizeWithKey(3600, 'tagRanking', getTagRanking);
export const getSubscriptionRankingCached = memorizeWithKey(3600, 'subscriptionRanking', getSubscriptionRanking);
export const getStampsCached = memorizeWithKey(3600, 'stamps', getStamps);
export const getStampsMeanUsageCached = memorizeWithKey(3600, 'stampsMeanUsage', getStampsMeanUsage);
export const getStampRelationsCached = memorizeWithKey(3600, 'stampRelations', getStampRelations);

export const forgotCaches = () => {
  purgeCache('messages');
  purgeCache('messageContents');
  purgeCache('channelMessageRanking');
  purgeCache('messagesRanking');
  purgeCache('messagesTimeline');
  purgeCache('stampRanking');
  purgeCache('channelStampsRanking');
  purgeCache('gaveMessageStampsRanking');
  purgeCache('receivedMessageStampsRanking');
  purgeCache('userGroupRanking');
  purgeCache('tagRanking');
  purgeCache('subscriptionRanking');
  purgeCache('stamps');
  purgeCache('stampsMeanUsage');
  purgeCache('stampRelations');
};
