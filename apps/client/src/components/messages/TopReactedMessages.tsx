import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { TraqMessage } from '@/components/messages/TraqMessage';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useStamps } from '@/hooks/useStamps';
import { StampImage } from '../StampImage';

type Props = {
  range?: DateRange;
  stampId: string | null;
  channelId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
  limit?: number;
};

export const TopReactedMessages: FC<Props> = ({ range, stampId, channelId, gaveUserId, receivedUserId, limit }) => {
  const query = useMemo(
    () =>
      ({
        ...(range && dateRangeToQuery(range)),
        channelId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        stampId: stampId ?? undefined,
        groupBy: 'message',
        orderBy: 'count',
        limit: limit ?? 10,
      }) satisfies StampsQuery,
    [range, stampId, channelId, gaveUserId, receivedUserId, limit],
  );
  const { stamps, loading } = useStamps(query);

  return (
    <div className={clsx('flex flex-col gap-2', loading && 'opacity-70')}>
      {stamps.map((s) => (
        <div key={s.message}>
          <TraqMessage
            messageId={s.message}
            annotation={
              <div className="flex gap-1">
                {stampId && <StampImage stampId={stampId} />}
                <span className="font-semibold">{s.count}</span>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
};
