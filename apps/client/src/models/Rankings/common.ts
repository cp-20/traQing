import { DailyTimeRange, MonthlyTimeRange } from '@/hooks/useTimeRange';
import { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const getCommonChartOptions = (fullLabels?: string[]) =>
  ({
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 1,
        borderColor: '#74c0fc',
        backgroundColor: '#228be633',
      },
    },
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
        grid: {
          display: false,
        },
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
  } satisfies ChartOptions);

export type DailyRankingProps = {
  range: DailyTimeRange;
};

export type MonthlyRankingProps = {
  range: MonthlyTimeRange;
};
