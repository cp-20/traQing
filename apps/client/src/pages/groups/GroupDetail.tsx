import { Badge, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { GroupIcon } from '@/components/icons/GroupIcon';
import {
  GroupGaveStampsRanking,
  GroupMessagesRanking,
  GroupReceivedStampsRanking,
} from '@/components/rankings/UserRanking';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useGroups } from '@/hooks/useGroups';
import { assert } from '@/lib/invariant';

type Props = {
  groupId: string;
};

export const GroupDetail: FC<Props> = ({ groupId }) => {
  const { getGroup } = useGroups();
  const range = useDateRangePicker('last-30-days');
  const group = getGroup(groupId);
  assert(group);

  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <GroupIcon className="size-8" />
        <div className="ml-4 text-2xl font-bold">@{group.name}</div>
      </ContainerTitle>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            グループ内投稿数ランキング
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <GroupMessagesRanking range={range.value} groupId={group.id} limit={20} />
      </Card>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            グループ内スタンプ数ランキング
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">つけたスタンプ</h3>
            <GroupGaveStampsRanking range={range.value} groupId={group.id} limit={20} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">もらったスタンプ</h3>
            <GroupReceivedStampsRanking range={range.value} groupId={group.id} limit={20} />
          </div>
        </div>
      </Card>
    </Container>
  );
};
