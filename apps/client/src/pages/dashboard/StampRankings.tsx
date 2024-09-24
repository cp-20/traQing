import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useStamps } from '@/hooks/useStamps';
import { StampImage, useStampPicker } from '@/composables/useStampPicker';
import { StampTimeline } from '@/components/timelines/StampTimeline';
import { TraqMessage } from '@/models/TraqMessage';
import { UserGaveSpecificStampRanking, UserReceivedSpecificStampRanking } from '@/models/UserRanking';
import { Card } from '@mantine/core';
import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';

export const StampRankings: FC = () => {
  const stampPicker = useStampPicker();
  const { getStamp } = useMessageStamps();
  const query = useMemo(
    () =>
      ({
        stampId: stampPicker.stampId ?? undefined,
        groupBy: 'message',
        orderBy: 'count',
        limit: 10,
      }) satisfies StampsQuery,
    [stampPicker.stampId],
  );
  const { stamps, loading } = useStamps(query);
  const stamp = stampPicker.stampId && getStamp(stampPicker.stampId);
  const StampElement = stamp ? (
    <img src={`/api/files/${stamp.fileId}`} width={24} height={24} alt={stamp.name} />
  ) : (
    'スタンプ'
  );

  return (
    <Card className="space-y-4">
      <div className="font-semibold text-xl">スタンプをつけた/もらったランキング</div>
      <div>{stampPicker.render()}</div>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
        <Card className="border">
          <div className="font-medium text mb-2 flex gap-1">
            {StampElement}
            <span>をたくさんつけた人</span>
          </div>
          <UserGaveSpecificStampRanking stampId={stampPicker.stampId} />
        </Card>
        <Card className="border">
          <div className="font-medium text mb-2 flex gap-1">
            {StampElement}
            <span>をたくさんもらった人</span>
          </div>
          <UserReceivedSpecificStampRanking stampId={stampPicker.stampId} />
        </Card>
      </div>
      <div className="flex flex-col-reverse gap-4 xl:flex-row">
        <Card className="border flex-1 max-h-[560px] overflow-auto">
          <div className="font-medium text mb-4 flex gap-1">
            {StampElement}
            <span>をたくさんつけられたメッセージ</span>
          </div>
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
        </Card>
        <Card className="border flex-1 max-h-fit h-fit">
          <div className="font-medium text mb-4 flex gap-1">
            {StampElement}
            <span>がつけられた数の推移</span>
          </div>
          <div>
            <StampTimeline stampId={stampPicker.stampId} />
          </div>
        </Card>
      </div>
    </Card>
  );
};
