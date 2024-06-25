import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useStamps } from '@/hooks/useStamps';
import { StampRanking } from '@/models/Rankings/StampRanking';
import { StampsQuery } from '@traq-ing/database';
import { FC, useMemo } from 'react';

type UserStampRankingProps = {
  userId: string;
};

export const UserGaveStampRanking: FC<UserStampRankingProps> = ({ userId }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        groupBy: 'stamp',
        orderBy: 'count',
        limit: 10,
      } satisfies StampsQuery),
    [userId]
  );
  const { getStamp } = useMessageStamps();
  const { stamps } = useStamps(query);
  const stats = stamps.map((s) => ({
    stamp: getStamp(s.stamp),
    count: s.count,
  }));

  return <StampRanking stats={stats} />;
};

export const UserReceivedStampRanking: FC<UserStampRankingProps> = ({
  userId,
}) => {
  const query = useMemo(
    () =>
      ({
        messageUserId: userId,
        groupBy: 'stamp',
        orderBy: 'count',
        limit: 10,
      } satisfies StampsQuery),
    [userId]
  );
  const { getStamp } = useMessageStamps();
  const { stamps } = useStamps(query);
  const stats = stamps.map((s) => ({
    stamp: getStamp(s.stamp),
    count: s.count,
  }));

  return <StampRanking stats={stats} />;
};
