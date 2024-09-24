import { memorize } from '@/cache';
import { api, machineToken } from '@/traQ/api';
import sharp from 'sharp';

const getAuthHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getMe = memorize(1000, async (token: string) => {
  const res = await api.users.getMe(getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.data;
});

export const getSubscriptions = memorize(100, async (token: string) => {
  const res = await api.users.getMyChannelSubscriptions(getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.data;
});

export const setSubscriptionLevel = async (token: string, channelId: string, level: number) => {
  const res = await api.users.setChannelSubscribeLevel(channelId, { level }, getAuthHeader(token));
  if (!res.ok) throw new Error('Failed to update subscription');
  return res.data;
};

export const getUsers = memorize(1000, async () => {
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
