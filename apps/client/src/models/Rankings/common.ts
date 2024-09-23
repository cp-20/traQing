import type { DailyTimeRange, MonthlyTimeRange } from '@/hooks/useTimeRange';
import { commonBarChartOptions, mergeOptions } from '@/models/commonChartOptions';
import type { ChartOptions } from 'chart.js';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const getCommonRankingChartOptions = (fullLabels?: string[]) =>
  mergeOptions(commonBarChartOptions, {
    indexAxis: 'y' as const,
    plugins: {
      tooltip: {
        enabled: true,
        axis: 'x',
        displayColors: false,
        callbacks: {
          title: (items) => fullLabels?.[items[0].dataIndex] ?? items[0].label,
        },
      },
    },
    scales: {
      y: {
        afterFit: (scaleInstance) => {
          scaleInstance.width = 150;
        },
      },
    },
  } satisfies ChartOptions);

export type DailyRankingProps = {
  range: DailyTimeRange;
};

export type MonthlyRankingProps = {
  range: MonthlyTimeRange;
};
