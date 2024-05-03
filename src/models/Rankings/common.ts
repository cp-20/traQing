import { DailyTimeRange, MonthlyTimeRange } from '@/hooks/useTimeRange';
import { ChartOptions } from 'chart.js';

export const commonChartOptions = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 1,
      borderColor: '#74c0fc',
      backgroundColor: '#228be633',
    },
  },
  scales: {
    y: {
      border: {
        display: false,
      },
      afterFit: (scaleInstance) => {
        scaleInstance.width = 150;
      },
      ticks: {
        font: { size: 12 },
      },
    },
  },
  font: {
    family: 'Noto Sans JP',
  },
  responsive: true,
  maintainAspectRatio: false,
} satisfies ChartOptions;

export type DailyRankingProps = {
  range: DailyTimeRange;
};

export type MonthlyRankingProps = {
  range: MonthlyTimeRange;
};
