// ref: https://github.com/Yoctol/react-d3-cloud/blob/b7a35e3d6a5db85a616847328c6f798213fb9667/src/WordCloud.tsx

import { useRef, memo, type FC, useEffect } from 'react';
import cloud from 'd3-cloud';
import isDeepEqual from 'react-fast-compare';
import { type BaseType, type ValueFn, select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

interface Datum {
  text: string;
  value: number;
}

export interface Word extends cloud.Word {
  text: string;
  value: number;
}

type Props = {
  data: Datum[];
  width?: number;
  height?: number;
  font?: string | ((word: Word, index: number) => string);
  fontStyle?: string | ((word: Word, index: number) => string);
  fontWeight?: string | number | ((word: Word, index: number) => string | number);
  fontSize?: number | ((word: Word, index: number) => number);
  spiral?: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => [number, number]);
  padding?: number | ((word: Word, index: number) => number);
  random?: () => number;
  fill?: ValueFn<SVGTextElement, Word, string>;
  onWordClick?: (this: BaseType, event: unknown, d: Word) => void;
  onWordMouseOver?: (this: BaseType, event: unknown, d: Word) => void;
  onWordMouseOut?: (this: BaseType, event: unknown, d: Word) => void;
};

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);

const WordCloud: FC<Props> = ({
  data,
  width = 700,
  height = 600,
  font = 'serif',
  fontStyle = 'normal',
  fontWeight = 'normal',
  fontSize = (d) => Math.sqrt(d.value),
  // eslint-disable-next-line no-bitwise
  spiral = 'archimedean',
  padding = 1,
  // @ts-ignore The ordinal function should accept number
  fill = (_, i) => defaultScaleOrdinal(i),
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // clear old data
    select(ref.current).select('svg').remove();

    // render based on new data
    const layout = cloud<Word>()
      .words(data)
      .size([width, height])
      .font(font)
      .fontStyle(fontStyle)
      .fontWeight(fontWeight)
      .fontSize(fontSize)
      .spiral(spiral)
      .padding(padding)
      .rotate(() => 0)
      .random(Math.random)
      .on('end', (words) => {
        const [w, h] = layout.size();

        const texts = select(ref.current)
          .append('svg')
          .attr('viewBox', `0 0 ${w} ${h}`)
          .attr('width', w)
          .attr('height', h)
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .append('g')
          .attr('transform', `translate(${w / 2},${h / 2})`)
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-family', ((d) => d.font) as ValueFn<SVGTextElement, Word, string>)
          .style('font-style', ((d) => d.style) as ValueFn<SVGTextElement, Word, string>)
          .style('font-weight', ((d) => d.weight) as ValueFn<SVGTextElement, Word, string | number>)
          .style('font-size', ((d) => `${d.size}px`) as ValueFn<SVGTextElement, Word, string>)
          .style('fill', fill)
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text((d) => d.text);

        if (onWordClick) {
          texts.on('click', onWordClick);
        }
        if (onWordMouseOver) {
          texts.on('mouseover', onWordMouseOver);
        }
        if (onWordMouseOut) {
          texts.on('mouseout', onWordMouseOut);
        }
      });

    layout.start();
  }, [
    data,
    fill,
    font,
    fontSize,
    fontWeight,
    fontStyle,
    height,
    onWordClick,
    onWordMouseOut,
    onWordMouseOver,
    padding,
    spiral,
    width,
  ]);

  return <div ref={ref} />;
};

export default memo(WordCloud, isDeepEqual);
