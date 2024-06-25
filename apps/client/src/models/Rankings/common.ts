import { DailyTimeRange, MonthlyTimeRange } from '@/hooks/useTimeRange';
import {
  commonBarChartOptions,
  mergeOptions,
} from '@/models/commonChartOptions';
import { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

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
