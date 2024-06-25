import {
  getCommonLineChartOptions,
  mergeOptions,
} from '@/models/commonChartOptions';
import {
  Chart as ChartJS,
  CategoryScale,
  ChartOptions,
  LinearScale,
  LineElement,
  Tooltip,
  PointElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  PointElement,
  Filler
);

export const commonTimelineChartOptions = mergeOptions(
  getCommonLineChartOptions(true),
  {
    plugins: {
      tooltip: {
        enabled: true,
        axis: 'y',
        displayColors: false,
      },
    },
  }
) satisfies ChartOptions;
