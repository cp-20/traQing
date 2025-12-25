import {
  getLastMessageCreatedAt,
  insertMessageStamps,
  insertMessages,
  updateMaterializedViews,
} from '@traq-ing/database';
import { sleep } from 'bun';
import { api } from '@/traQ/api';

export const updateMessages = async (getAll: boolean) => {
  const after = await (async () => {
    if (getAll) return undefined;
    const lastMessage = await getLastMessageCreatedAt();
    const after = lastMessage ? new Date(lastMessage.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString() : undefined;
    return after;
  })();
  // let before = new Date().toISOString();
  let before = '2025-08-09T10:37:20.159593Z';

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
