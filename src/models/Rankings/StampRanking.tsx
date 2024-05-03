import { FC } from 'react';
import { Stamp } from 'traq-bot-ts';

type Props = {
  stats: {
    stamp: Stamp | null;
    count: number;
  }[];
};

export const StampRanking: FC<Props> = ({ stats }) => {
  return (
    <table className="w-full">
      <tbody>
        {stats.map((stamp, i) => (
          <tr key={stamp.stamp?.id}>
            <td className="w-8">#{i + 1}</td>
            <td className="w-10">
              <img
                width="24"
                height="24"
                src={`/api/files/${stamp.stamp?.fileId}`}
                alt=""
              />
            </td>
            <td>
              <code className="text-sm px-1 py-[0.05rem] bg-gray-200 rounded-sm font-mono">
                {stamp.stamp?.name}
              </code>
            </td>
            <td className="w-8 text-right">
              <code>{stamp.count}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
