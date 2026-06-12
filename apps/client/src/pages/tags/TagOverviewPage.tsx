import { Group, Text, Title } from '@mantine/core';
import type { FC } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { TagIcon } from '@/components/icons/TagIcon';
import { TagRanking } from '@/components/rankings/TagRanking';

export const TagOverviewPage: FC = () => {
  return (
    <Container>
      <ContainerTitle>
        <TagIcon className="size-8" />
        <span>タグ</span>
      </ContainerTitle>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            タグランキング
          </Title>
          <Text size="sm" c="dimmed">
            現在値
          </Text>
        </Group>
        <TagRanking limit={50} />
      </Card>
    </Container>
  );
};
