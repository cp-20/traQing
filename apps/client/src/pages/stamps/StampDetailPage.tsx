import { Loader } from '@mantine/core';
import clsx from 'clsx';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { assert } from '@/lib/invariant';
import { StampDetail } from '@/pages/stamps/StampDetail';

export const StampDetailPage: FC = () => {
  const { stampName } = useParams<{ stampName: string }>();
  assert(stampName);
  const { getStampId, stamps } = useMessageStamps();
  const stampId = getStampId(stampName);

  return (
    <div className="traqing-loading-host relative">
      <div
        className={clsx(
          'traqing-loading-overlay grid place-content-center absolute inset-0 duration-200 transition-all ease-in',
          stamps !== undefined && 'invisible opacity-0',
        )}
      >
        <Loader type="bars" size="xl" />
      </div>
      {stamps !== undefined && !stampId && (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-semibold">
            <span>:{stampName}:</span>
            <span> というスタンプが見つかりません</span>
          </div>
          <div>
            <Link to="/" className="underline text-blue-500">
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
      {stampId && <StampDetail stampId={stampId} />}
    </div>
  );
};
