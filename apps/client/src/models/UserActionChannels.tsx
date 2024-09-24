import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { ChannelRankingItemWithUsers } from '@/components/rankings/channel';
import type { DateRange } from '@/composables/useDateRangePicker';

type UserActionChannelsProps = {
  userId: string;
  range?: DateRange;
};

export const UserMessageChannels: FC<UserActionChannelsProps> = ({ userId, range }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        groupBy: 'channel',
        limit: 20,
      }) satisfies MessagesQuery,
    [userId],
  );
  const { messages } = useMessages(query);

  return (
    <div>
      {messages.map((m, i) => (
        <ChannelRankingItemWithUsers
          range={range}
          key={m.channel}
          rank={i + 1}
          channelId={m.channel}
          value={m.count}
          rate={m.count / messages[0].count}
        />
      ))}
    </div>
  );
};

export const UserGaveStampsChannels: FC<UserActionChannelsProps> = ({ userId, range }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        groupBy: 'channel',
        limit: 20,
      }) satisfies StampsQuery,
    [userId],
  );
  const { stamps } = useStamps(query);

  return (
    <div>
      {stamps.map((s, i) => (
        <ChannelRankingItemWithUsers
          range={range}
          key={s.channel}
          rank={i + 1}
          channelId={s.channel}
          value={s.count}
          rate={s.count / stamps[0].count}
        />
      ))}
    </div>
  );
};
