import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { StampImage } from '@/composables/useStampPicker';
import { useChannels } from '@/hooks/useChannels';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useUsers } from '@/hooks/useUsers';
import { assert } from '@/lib/invariant';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';

type RowType = Partial<{
  channel: string;
  user: string;
  messageUser: string;
  stamp: string;
  month: string;
  day: string;
  hour: string;
  count: number;
}>;

type ColumnType = keyof RowType;

const rows: { [K in ColumnType]: string } = {
  channel: 'チャンネル',
  user: 'ユーザー',
  messageUser: '投稿ユーザー',
  stamp: 'スタンプ',
  month: '月',
  day: '日',
  hour: '時',
  count: '件数',
};

const numberColumns: ColumnType[] = ['count'];

type Props<Row extends RowType> = {
  result: Row[];
};

export const PlaygroundResult = <Row extends RowType>({ result }: Props<Row>) => {
  if (result.length === 0) {
    return <div>データがありません</div>;
  }

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          {Object.entries(rows)
            .filter(([key]) => result[0][key as ColumnType] !== undefined)
            .map(([key, value]) => (
              <th
                key={key}
                scope="col"
                className={clsx('px-4 py-2 border-gray-300 border text-left', key === 'count' && 'w-20 text-right')}
              >
                {value}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {result.map((row, i) => (
          <tr key={i}>
            {Object.entries(rows)
              .filter(([key]) => row[key as ColumnType] !== undefined)
              .map(([key]) => (
                <td
                  key={key}
                  className={clsx(
                    'px-4 py-2 border-gray-300 border',
                    numberColumns.includes(key as ColumnType) && 'text-right',
                    key === 'count' && 'w-20',
                  )}
                >
                  {/* biome-ignore lint/style/noNonNullAssertion: Object.entries */}
                  {convertColumn(key as ColumnType, row[key as ColumnType]!)}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ChannelName: FC<{ channelId: string }> = ({ channelId }) => {
  const { getChannelName } = useChannels();
  const channel = getChannelName(channelId);
  assert(channel);
  return (
    <Link to={`/channels/${channel}`} className="flex group hover:text-blue-500">
      <ChannelIcon className="size-6" />
      <span className="font-medium">{channel}</span>
    </Link>
  );
};

const UserName: FC<{ userId: string }> = ({ userId }) => {
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);
  assert(user);
  return (
    <Link to={`/users/${encodeURIComponent(user.name)}`} className="flex gap-2 items-center group hover:text-blue-500">
      <UserAvatar userId={userId} className="size-6" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.displayName}</span>
        <span className="text-xs text-gray-400 -my-1">@{user.name}</span>
      </div>
    </Link>
  );
};

const StampName: FC<{ stampId: string }> = ({ stampId }) => {
  const { getStamp } = useMessageStamps();
  const stamp = getStamp(stampId);
  assert(stamp);
  return (
    <Link to={`/stamps/${stamp.name}`} className="flex gap-2 items-center group hover:text-blue-500">
      <StampImage stampId={stampId} className="size-6" />
      <span>{stamp.name}</span>
    </Link>
  );
};

const convertColumn = (column: ColumnType, value: string | number): ReactNode => {
  if (column === 'channel') {
    return <ChannelName channelId={value as string} />;
  }
  if (column === 'user' || column === 'messageUser') {
    return <UserName userId={value as string} />;
  }
  if (column === 'stamp') {
    return <StampName stampId={value as string} />;
  }
  return value;
};
