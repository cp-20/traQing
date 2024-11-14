import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';
import { searchUsers } from '@/lib/search';
import { Popover, ScrollArea, TextInput, type TextInputProps } from '@mantine/core';
import { type FC, useMemo, useState } from 'react';

type Props = {
  reducer: ReturnType<typeof useUserSelect>;
  textInputProps?: TextInputProps;
};

export const useUserSelect = () => {
  const [userId, setUserId] = useState<string | null>(null);

  return {
    userId,
    state: { userId },
    actions: { setUserId },
  };
};

export const UserSelect: FC<Props> = ({ reducer, textInputProps }) => {
  const { userId } = reducer.state;
  const { setUserId } = reducer.actions;
  const [keyword, setKeyword] = useState<string>('');
  const [opened, setOpened] = useState(false);
  const { users } = useUsers();

  const currentUser = useMemo(() => users?.find((u) => u.id === userId), [users, userId]);
  const filteredStamps = useMemo(() => users && searchUsers(users, keyword), [users, keyword]);

  return (
    <div>
      <Popover width="target" position="bottom" shadow="sm" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <TextInput
            placeholder="ユーザー名を入力"
            value={keyword}
            onFocus={() => setOpened(true)}
            leftSection={
              currentUser ? (
                <div className="inline-grid place-content-center p-1">
                  <UserAvatar userId={currentUser.id} />
                </div>
              ) : null
            }
            onChange={(e) => {
              setKeyword(e.target.value);
              const user = users?.find((s) => s.name === e.target.value);
              if (user) setUserId(user.id);
              if (e.target.value === '') setUserId(null);
            }}
            {...textInputProps}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ScrollArea.Autosize type="scroll" mah={320} className="-my-3 -mx-4">
            {filteredStamps?.length === 0 && <div className="text-gray-400">ユーザーが見つかりません</div>}
            <div className="flex flex-col gap-2 w-full">
              {filteredStamps?.slice(0, 100).map((u) => (
                <button
                  type="button"
                  title={u.name}
                  key={u.id}
                  onClick={() => {
                    setKeyword(u.name);
                    setUserId(u.id);
                    setOpened(false);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-1"
                >
                  <UserAvatar userId={u.id} />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{u.displayName}</span>
                    <span className="text-xs text-gray-400 -mt-1">@{u.name.split('#')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};
