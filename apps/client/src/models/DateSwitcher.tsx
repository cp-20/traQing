import { useDailyTimeRange, useMonthlyTimeRange } from '@/hooks/useTimeRange';
import { Button } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { type FC, useMemo } from 'react';

type SwitcherProps = {
  switcher: {
    prev: () => void;
    next: () => void;
    currentRange: string;
    canGoNext: boolean;
  };
};

export const DateSwitcher: FC<SwitcherProps> = ({ switcher }) => {
  return (
    <Button.Group>
      <Button
        color="gray"
        variant="outline"
        p={4}
        onClick={switcher.prev}
        size="compact-md"
        className="disabled:border-[var(--mantine-color-gray-outline)] !border-r-0"
      >
        <IconChevronLeft />
      </Button>
      <Button color="gray" variant="outline" size="compact-md" className="text-sm">
        {switcher.currentRange}
      </Button>
      <Button
        color="gray"
        variant="outline"
        p={4}
        onClick={switcher.next}
        size="compact-md"
        disabled={!switcher.canGoNext}
        className="disabled:border-[var(--mantine-color-gray-outline)] disabled:cursor-not-allowed !border-l-0"
      >
        <IconChevronRight />
      </Button>
    </Button.Group>
  );
};

export const useMonthlySwitcher = () => {
  const { range, prev, next } = useMonthlyTimeRange();
  const canGoNext = new Date() > new Date(range.year, range.month);

  const month = range.month.toString().padStart(2, '0');
  const currentRange = `${range.year}-${month}`;

  const switcher = useMemo(() => ({ prev, next, currentRange, canGoNext }), [canGoNext, currentRange, prev, next]);

  return { switcher, range };
};

export const useDailySwitcher = () => {
  const { range, prev, next } = useDailyTimeRange();
  const canGoNext = new Date() > new Date(range.year, range.month - 1, range.day + 1);

  const month = range.month.toString().padStart(2, '0');
  const day = range.day.toString().padStart(2, '0');
  const currentRange = `${range.year}-${month}-${day}`;

  const switcher = useMemo(() => ({ prev, next, currentRange, canGoNext }), [canGoNext, currentRange, prev, next]);

  return { switcher, range };
};
