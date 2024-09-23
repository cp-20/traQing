import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useStamps } from '@/hooks/useStamps';
import { StampImage, StampPicker } from '@/models/StampPicker';
import { TraqMessage } from '@/models/TraqMessage';
import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, useMemo, useState } from 'react';

type UserTopReactedMessagesProps = {
  userId: string;
};

export const UserTopReactedMessages: FC<UserTopReactedMessagesProps> = ({ userId }) => {
  const [stampId, setStampId] = useState<string | null>(null);
  const { getStamp } = useMessageStamps();
  const query = useMemo(
    () =>
      ({
        messageUserId: userId,
        stampId: stampId ?? undefined,
        groupBy: 'message',
        orderBy: 'count',
        limit: 10,
      }) satisfies StampsQuery,
    [stampId],
  );
  const { stamps, loading } = useStamps(query);
  const stamp = stampId && getStamp(stampId);

  return (
    <div className="flex flex-col gap-2">
      <StampPicker setStampId={setStampId} />
      <div className={clsx('flex flex-col gap-2', loading && 'opacity-70')}>
        {stamps.map((s) => (
          <div key={s.message}>
            <TraqMessage
              messageId={s.message}
              annotation={
                <div className="flex gap-1">
                  {stamp && <StampImage fileId={stamp.fileId} />}
                  <span className="font-semibold">{s.count}</span>
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
