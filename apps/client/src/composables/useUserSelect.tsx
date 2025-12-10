import { Popover, ScrollArea, TextInput, type TextInputProps } from '@mantine/core';
import { type FC, useEffect, useMemo, useState } from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';
import { searchUsers } from '@/lib/search';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: 外部から setUserId された時の処理
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.name !== keyword) {
      setKeyword(currentUser.name);
    }
  }, [userId, currentUser]);

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
                  <UserAvatar user={currentUser} />
                </div>
              ) : null
            }
            onBlur={(e) => {
              if (e.relatedTarget?.classList.contains('user-select-button')) return;
              setOpened(false);
              const user = users?.find((s) => s.name === e.target.value);
              if (!user) {
                setKeyword(currentUser?.name ?? '');
              }
              if (e.target.value === '') setUserId(null);
            }}
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
                  className="user-select-button flex items-center gap-2 hover:bg-gray-100 px-4 py-1"
                >
                  <UserAvatar user={u} />
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
