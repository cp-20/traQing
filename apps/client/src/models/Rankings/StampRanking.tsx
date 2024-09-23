import { Skeleton } from '@mantine/core';
import type { FC } from 'react';
import type { Stamp } from 'traq-bot-ts';

type Props = {
  stats: {
    stamp: Stamp | undefined;
    count: number;
  }[];
};

export const StampRanking: FC<Props> = ({ stats }) => {
  return (
    <table className="w-full">
      <tbody>
        {stats.map((stamp, i) => (
          <tr key={i}>
            <td className="min-w-8 w-8">#{i + 1}</td>
            {stamp.stamp === undefined && (
              <div className="flex items-center h-7">
                <Skeleton h={16} />
              </div>
            )}
            {stamp.stamp !== undefined && (
              <>
                <td className="min-w-10 w-10">
                  <img width="24" height="24" src={`/api/files/${stamp.stamp?.fileId}`} alt="" />
                </td>
                <td>
                  <code className="text-sm px-1 py-[0.05rem] bg-gray-200 rounded-sm font-mono">
                    {stamp.stamp?.name}
                  </code>
                </td>
                <td className="w-8 text-right">
                  <code>{stamp.count}</code>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
