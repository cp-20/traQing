import { useCountUp } from 'react-countup';
import clsx from 'clsx';
import { type ReactNode, type ComponentProps, type FC, useState, useRef, useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { Card } from '@/components/Card';

type Props = {
  label: ReactNode;
  value: number;
  valueProps?: ComponentProps<'span'>;
  unit?: ReactNode;
  annotation?: ReactNode;
  duration?: number;
  start: number;
};

export const AnimatedStat: FC<Props> = ({ label, value, valueProps, unit, annotation, duration, start }) => {
  const countUpRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const count = useCountUp({
    ref: countUpRef,
    start,
    end: value,
    duration: duration ?? 2,
    startOnMount: false,
    onEnd: () => setEnded(true),
  });

  const { ref: containerRef, entry } = useIntersection({
    threshold: 0,
    rootMargin: '0px 0px -20% 0px',
  });

  useEffect(() => {
    if (entry?.isIntersecting && !started) {
      count.start();
      setStarted(true);
    }
  }, [started, entry, count.start]);

  return (
    <Card ref={containerRef}>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div>
          <span
            {...valueProps}
            className={clsx('text-4xl text-blue-600 font-medium', valueProps?.className)}
            ref={countUpRef}
          />
          {unit && <span>{unit}</span>}
        </div>
        {annotation &&
          (ended ? (
            <div className="text-sm mt-1 animate-wipe-right">{annotation}</div>
          ) : (
            <div className="text-sm mt-1 h-5" />
          ))}
      </div>
    </Card>
  );
};
