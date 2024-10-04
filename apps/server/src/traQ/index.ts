import {
  deleteChannelPins,
  deleteChannelSubscriptions,
  deleteTags,
  deleteUserGroupRelations,
  getChannelPins,
  getChannelSubscriptions,
  getLastMessageCreatedAt,
  getTags,
  getUserGroupRelations,
  insertChannelPins,
  insertChannelSubscriptions,
  insertChannels,
  insertGroups,
  insertMessageStamps,
  insertMessages,
  insertTags,
  insertUserGroupRelations,
  insertUsers,
  updateMaterializedViews,
} from '@traq-ing/database';
import { api } from './api';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateMessages = async () => {
  const lastMessage = await getLastMessageCreatedAt();
  const after = lastMessage ? new Date(lastMessage.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString() : undefined;
  let before = new Date().toISOString();

  const res = await api.users.getUsers();
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const users = res.data;
  const isBot = (id: string) => users.find((u) => u.id === id)?.bot ?? false;

  let offset = 0;
  while (true) {
    const res = await api.messages.searchMessages({
      sort: 'createdAt',
      limit: 100,
      after,
      before,
    });
    if (!res.ok) continue;

    const searched = res.data.hits;
    if (searched.length === 0) break;

    const messages = searched.map((m) => ({
      id: m.id,
      userId: m.userId,
      channelId: m.channelId,
      content: m.content.replaceAll('\u0000', ''),
      createdAt: new Date(m.createdAt),
      pinned: m.pinned,
      isBot: isBot(m.userId),
    }));

    await insertMessages(messages);

    const stamps = searched.flatMap((m) =>
      m.stamps.map((s) => ({
        messageId: m.id,
        userId: s.userId,
        stampId: s.stampId,
        channelId: m.channelId,
        messageUserId: m.userId,
        count: s.count,
        createdAt: new Date(s.createdAt),
        isBot: isBot(m.userId),
        isBotMessage: isBot(s.userId),
      })),
    );

    if (stamps.length > 0) {
      await insertMessageStamps(stamps);
    }

    offset += searched.length;
    before = searched[searched.length - 1].createdAt;

    console.log(offset, searched[searched.length - 1].createdAt);
    await sleep(100);
  }

  await updateMaterializedViews();
};

const getDiff = <T>(before: T[], after: T[], comp: (a: T, b: T) => boolean) => {
  const added = after.filter((a) => !before.some((b) => comp(a, b)));
  const deleted = before.filter((b) => !after.some((a) => comp(a, b)));
  return { added, deleted };
};

export const updateStatistics = async () => {
  // users
  const userRes = await api.users.getUsers();
  if (!userRes.ok) throw new Error('Failed to fetch users');
  const users = userRes.data;
  await insertUsers(
    users.map((user) => ({
      id: user.id,
      isBot: user.bot,
      updatedAt: new Date(user.updatedAt),
    })),
  );

  // groups
  const groupRes = await api.groups.getUserGroups();
  if (!groupRes.ok) throw new Error('Failed to fetch groups');
  const groups = groupRes.data;
  await insertGroups(
    groups.map((group) => ({
      id: group.id,
      name: group.name,
      updatedAt: new Date(group.updatedAt),
    })),
  );
  const insertedUserGroupRelations = await getUserGroupRelations();
  const newUserGroupRelations = groups.flatMap((group) =>
    group.members.map((user) => ({
      userId: user.id,
      groupId: group.id,
      isAdmin: group.admins.includes(user.id),
    })),
  );
  const userGroupRelationsDiff = getDiff(
    insertedUserGroupRelations,
    newUserGroupRelations,
    (a, b) => a.userId === b.userId && a.groupId === b.groupId,
  );
  await insertUserGroupRelations(userGroupRelationsDiff.added);
  await deleteUserGroupRelations(userGroupRelationsDiff.deleted);

  // tags
  const newTags = [];
  for (const user of users) {
    const res = await api.users.getUser(user.id);
    if (!res.ok) throw new Error('Failed to fetch user');
    const userData = res.data;
    newTags.push(
      ...userData.tags.map((tag) => ({
        userId: user.id,
        name: tag.tag,
      })),
    );
  }
  const insertedTags = await getTags();
  const tagsDiff = getDiff(insertedTags, newTags, (a, b) => a.userId === b.userId && a.name === b.name);
  await insertTags(tagsDiff.added);
  await deleteTags(tagsDiff.deleted);

  // channels
  const channelRes = await api.channels.getChannels();
  if (!channelRes.ok) throw new Error('Failed to fetch channels');
  const channels = channelRes.data.public;
  await insertChannels(channels.map((channel) => ({ id: channel.id })));

  // channel subscriptions
  const newChannelSubscriptions = [];
  for (const channel of channels) {
    const res = await api.channels.getChannelSubscribers(channel.id);
    if (!res.ok) throw new Error('Failed to fetch channel subscriptions');
    const subscriptions = res.data;
    newChannelSubscriptions.push(
      ...subscriptions.map((subscription) => ({
        userId: subscription,
        channelId: channel.id,
      })),
    );
  }
  const insertedChannelSubscriptions = await getChannelSubscriptions();
  const channelSubscriptionsDiff = getDiff(
    insertedChannelSubscriptions,
    newChannelSubscriptions,
    (a, b) => a.userId === b.userId && a.channelId === b.channelId,
  );
  await insertChannelSubscriptions(channelSubscriptionsDiff.added);
  await deleteChannelSubscriptions(channelSubscriptionsDiff.deleted);

  // channel pins
  const newChannelPins = [];
  for (const channel of channels) {
    const res = await api.channels.getChannelPins(channel.id);
    if (!res.ok) throw new Error('Failed to fetch channel pins');
    const pins = res.data;
    newChannelPins.push(
      ...pins.map((pin) => ({
        channelId: channel.id,
        messageId: pin.message.id,
      })),
    );
  }
  const insertedChannelPins = await getChannelPins();
  const channelPinsDiff = getDiff(
    insertedChannelPins,
    newChannelPins,
    (a, b) => a.channelId === b.channelId && a.messageId === b.messageId,
  );
  await insertChannelPins(channelPinsDiff.added);
  await deleteChannelPins(channelPinsDiff.deleted);
};
