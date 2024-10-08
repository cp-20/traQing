import type { Stamp, User } from 'traq-bot-ts';

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

export const searchStamps = (stamps: Stamp[], keyword: string) => {
  return stamps
    .filter((prof) => prof.name.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => sort(a.name, b.name, keyword));
};

export const searchUsers = (users: User[], keyword: string) => {
  return users
    .filter((user) => user.name.toLowerCase().includes(keyword.toLowerCase()) || user.displayName.includes(keyword))
    .sort((a, b) => sort(a.name, b.name, keyword));
};
