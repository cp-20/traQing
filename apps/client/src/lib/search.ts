import type { Channel, Stamp, User, UserGroup } from 'traq-bot-ts';

const sort = (a: string, b: string, keyword: string, indexOfMap: Map<string, number>) => {
  const aIndex = indexOfMap.get(a) ?? a.toLowerCase().indexOf(keyword.toLowerCase());
  const bIndex = indexOfMap.get(b) ?? a.toLowerCase().indexOf(keyword.toLowerCase());
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

const memorized = <T>(fn: (contents: T[], keyword: string) => T[]) => {
  const cache = new Map<string, T[]>();
  return (contents: T[], keyword: string) => {
    if (!cache.has(`${contents.length}-${keyword}`)) {
      cache.set(`${contents.length}-${keyword}`, fn(contents, keyword));
    }
    // biome-ignore lint/style/noNonNullAssertion: 自明に存在する
    return cache.get(`${contents.length}-${keyword}`)!;
  };
};

export const searchUsers = memorized((users: User[], keyword: string) => {
  const lowercasedKeyword = keyword.toLowerCase();
  const keywordIndexOfMap = new Map(users.map((user) => [user.id, user.name.toLowerCase().indexOf(lowercasedKeyword)]));
  return users
    .filter((user) => user.name.toLowerCase().includes(lowercasedKeyword) || user.displayName.includes(keyword))
    .sort((a, b) => sort(a.name, b.name, lowercasedKeyword, keywordIndexOfMap));
});

export const searchChannels = memorized((channels: Channel[], keyword: string) => {
  const channelMap = new Map(channels.map((channel) => [channel.id, channel]));
  const paths = keyword.split('/');
  const search = (channels: Channel[], keyword: string) => {
    const lowercasedKeyword = keyword.toLowerCase();
    const keywordIndexOfMap = new Map(
      channels.map((channel) => [channel.id, channel.name.toLowerCase().indexOf(lowercasedKeyword)]),
    );
    return channels
      .filter((channel) => channel.name.toLowerCase().includes(lowercasedKeyword))
      .sort((a, b) => (a.parentId ? 1 : b.parentId ? -1 : sort(a.name, b.name, lowercasedKeyword, keywordIndexOfMap)));
  };
  let filtered = channels;
  for (const [i, path] of paths.entries()) {
    filtered = search(filtered, path);
    if (filtered.length === 0) return [];
    if (paths.length === i + 1) return filtered;
    // biome-ignore lint/style/noNonNullAssertion: 必ず channel は存在する
    filtered = filtered.flatMap((v) => v.children.map((id) => channelMap.get(id)!));
  }
  return [];
});

export const searchStamps = memorized((stamps: Stamp[], keyword: string) => {
  const lowercasedKeyword = keyword.toLowerCase();
  const keywordIndexOfMap = new Map(
    stamps.map((stamp) => [stamp.id, stamp.name.toLowerCase().indexOf(lowercasedKeyword)]),
  );
  return stamps
    .filter((prof) => prof.name.toLowerCase().includes(lowercasedKeyword))
    .sort((a, b) => sort(a.name, b.name, lowercasedKeyword, keywordIndexOfMap));
});

export const searchGroups = memorized((groups: UserGroup[], keyword: string) => {
  const lowercasedKeyword = keyword.toLowerCase();
  const keywordIndexOfMap = new Map(
    groups.map((group) => [group.id, group.name.toLowerCase().indexOf(lowercasedKeyword)]),
  );
  return groups
    .filter((group) => group.name.toLowerCase().includes(lowercasedKeyword))
    .sort((a, b) => sort(a.name, b.name, lowercasedKeyword, keywordIndexOfMap));
});
