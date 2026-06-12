import { Badge, Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { type FC, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { StampIcon } from '@/components/icons/StampIcon';
import { StampRanking } from '@/components/rankings/StampRanking';
import { StampImage } from '@/components/StampImage';
import { TopStampsTimeline } from '@/components/timelines/TopStampsTimeline';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { searchStamps } from '@/lib/search';

const SearchStampBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { stamps } = useMessageStamps();

  const filteredStamps = stamps && searchStamps(stamps, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="スタンプ名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="traqing-search-list h-96 overflow-y-scroll">
        {filteredStamps?.slice(0, 100).map((stamp) => (
          <Link
            key={stamp.id}
            to={`/stamps/${stamp.name}`}
            className="traqing-search-row flex items-center gap-2 px-4 py-2 transition-colors duration-150"
          >
            <StampImage stampId={stamp.id} />
            <span>:{stamp.name}:</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton circle h={24} w={24} />
              <Skeleton h={24} />
            </div>
          ))}
        {filteredStamps?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのスタンプは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const StampOverviewPage: FC = () => {
  const range = useDateRangePicker('last-30-days');
  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <StampIcon className="size-8" />
        <span>スタンプ</span>
      </ContainerTitle>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            つけられた数
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
          <StampRanking limit={20} range={range.value} />
          <div>
            <TopStampsTimeline range={range.value} />
          </div>
        </div>
      </Card>

      <Card>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={2} size="h4">
              スタンプ検索
            </Title>
            <Text size="sm" c="dimmed">
              全スタンプ
            </Text>
          </Group>
          <SearchStampBlock />
        </Stack>
      </Card>
    </Container>
  );
};
