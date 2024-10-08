import type { Channel, Stamp, User } from 'traq-bot-ts';

const sort = (a: string, b: string, keyword: string) => {
  const aIndex = a.toLowerCase().indexOf(keyword.toLowerCase());
  const bIndex = b.toLowerCase().indexOf(keyword.toLowerCase());
  return aIndex > bIndex
    ? 1
    : aIndex < bIndex
      ? -1
      : a.length > b.length
        ? 1
        : a.length < b.length
          ? -1
          : a > b
            ? 1
            : a < b
              ? -1
              : 0;
};

export const searchUsers = (users: User[], keyword: string) => {
  return users
    .filter((user) => user.name.toLowerCase().includes(keyword.toLowerCase()) || user.displayName.includes(keyword))
    .sort((a, b) => sort(a.name, b.name, keyword));
};

export const searchChannels = (channels: Channel[], keyword: string) => {
  const channelMap = new Map(channels.map((channel) => [channel.id, channel]));
  const paths = keyword.split('/');
  const search = (channels: Channel[], keyword: string) =>
    channels
      .filter((channel) => channel.name.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => (a.parentId ? 1 : b.parentId ? -1 : sort(a.name, b.name, keyword)));
  let filtered = channels;
  for (const [i, path] of paths.entries()) {
    filtered = search(filtered, path);
    if (filtered.length === 0) return [];
    if (paths.length === i + 1) return filtered;
    // biome-ignore lint/style/noNonNullAssertion: 必ず channel は存在する
    filtered = filtered.flatMap((v) => v.children.map((id) => channelMap.get(id)!));
  }
};

export const searchStamps = (stamps: Stamp[], keyword: string) => {
  return stamps
    .filter((prof) => prof.name.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => sort(a.name, b.name, keyword));
};
