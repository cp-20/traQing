import { useStamps } from '@/hooks/useStamps';
import { StampImage } from '@/composables/useStampPicker';
import { TraqMessage } from '@/components/messages/TraqMessage';
import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';

type Props = {
  stampId: string | null;
  channelId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
};

export const TopReactedMessages: FC<Props> = ({ stampId, channelId, gaveUserId, receivedUserId }) => {
  const query = useMemo(
    () =>
      ({
        channelId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        stampId: stampId ?? undefined,
        groupBy: 'message',
        orderBy: 'count',
        limit: 10,
      }) satisfies StampsQuery,
    [stampId, channelId, gaveUserId, receivedUserId],
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
