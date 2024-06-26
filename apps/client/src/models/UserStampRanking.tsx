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
  const { stamps } = useStamps(query);
  const stats = useUserStampRanking(stamps);

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
  const { stamps } = useStamps(query);
  const stats = useUserStampRanking(stamps);

  return <StampRanking stats={stats} />;
};

const useUserStampRanking = (stamps: { stamp: string; count: number }[]) => {
  const { getStamp } = useMessageStamps();

  if (stamps.length === 0)
    return new Array(10).fill(0).map(() => ({ stamp: undefined, count: 0 }));

  const stats = stamps.map((s) => ({
    stamp: getStamp(s.stamp),
    count: s.count,
  }));

  return stats;
};
