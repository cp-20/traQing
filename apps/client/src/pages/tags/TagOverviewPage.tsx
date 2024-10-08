import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { TagIcon } from '@/components/icons/TagIcon';
import { TagRanking } from '@/components/rankings/TagRanking';
import type { FC } from 'react';

export const TagOverviewPage: FC = () => {
  return (
    <Container>
      <ContainerTitle>
        <TagIcon className="size-8" />
        <span className="ml-2 text-2xl font-bold">タグ</span>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">タグランキング</h2>
        <TagRanking limit={50} />
      </Card>
    </Container>
  );
};
