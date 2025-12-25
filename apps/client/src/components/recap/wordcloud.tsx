import { Skeleton } from '@mantine/core';
import type { MessageContentsQuery } from '@traq-ing/database';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { type CommonRecapComponentProps, yearToQuery } from '@/components/recap/common';
import WordCloud from '@/components/WordCloud';
import { useMessageContents } from '@/hooks/useMessageContents';

export const WordCloudRecap: FC<CommonRecapComponentProps> = ({ userId, year }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200);

  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        userId,
        limit: 500,
      }) satisfies MessageContentsQuery,
    [year, userId],
  );
  const { contents, loading } = useMessageContents(query);

  useEffect(() => {
    if (!containerRef.current) return;
    if (width === containerRef.current.clientWidth) return;
    setWidth(containerRef.current.clientWidth);
  });

  if (loading) {
    return <Skeleton w="100%" h={600} />;
  }

  return (
    <div className="flex flex-wrap gap-2" ref={containerRef}>
      <WordCloud
        data={contents}
        width={width}
        height={600}
        font="Noto Sans JP"
        fontWeight="bold"
        fontSize={(word) => word.value ** 0.7 * (width / 800)}
        padding={5}
        random={Math.random}
      />
    </div>
  );
};
