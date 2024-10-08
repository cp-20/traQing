import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { GroupIcon } from '@/components/icons/GroupIcon';
import {
  GroupGaveStampsRanking,
  GroupMessagesRanking,
  GroupReceivedStampsRanking,
} from '@/components/rankings/UserRanking';
import { useGroups } from '@/hooks/useGroups';
import { assert } from '@/lib/invariant';
import type { FC } from 'react';

type Props = {
  groupId: string;
};

export const GroupDetail: FC<Props> = ({ groupId }) => {
  const { getGroup } = useGroups();
  const group = getGroup(groupId);
  assert(group);

  return (
    <Container>
      <ContainerTitle>
        <GroupIcon className="size-8" />
        <div className="ml-4 text-2xl font-bold">@{group.name}</div>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">グループ内投稿数ランキング</h2>
        <GroupMessagesRanking groupId={group.id} limit={20} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">グループ内スタンプ数ランキング</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">つけたスタンプ</h3>
            <GroupGaveStampsRanking groupId={group.id} limit={20} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">もらったスタンプ</h3>
            <GroupReceivedStampsRanking groupId={group.id} limit={20} />
          </div>
        </div>
      </Card>
    </Container>
  );
};
