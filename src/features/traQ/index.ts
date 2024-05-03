import {
  getLastMessageCreatedAt,
  insertMessageStamps,
  insertMessages,
} from '@/features/database/repository';
import { api } from './api';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  const second = `${date.getSeconds()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
};

export const updateMessages = async () => {
  const lastMessage = await getLastMessageCreatedAt();
  const after = lastMessage ? formatDateStr(new Date(lastMessage)) : undefined;

  let before = formatDateStr(new Date());
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
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
      content: m.content,
      createdAt: m.createdAt,
      createdAtTimestamp: Math.floor(new Date(m.createdAt).getTime() / 1000),
      pinned: m.pinned ? 1 : 0,
    }));

    await insertMessages(messages);

    const stamps = searched.flatMap((m) =>
      m.stamps.map((s) => ({
        messageId: m.id,
        userId: s.userId,
        stampId: s.stampId,
        channelId: m.channelId,
        count: s.count,
        createdAt: s.createdAt,
        createdAtTimestamp: Math.floor(new Date(s.createdAt).getTime() / 1000),
      }))
    );

    if (stamps.length > 0) {
      await insertMessageStamps(stamps);
    }

    offset += searched.length;
    before = searched[searched.length - 1].createdAt;

    console.log(offset, searched[searched.length - 1].createdAt);
    await sleep(100);
  }
};
