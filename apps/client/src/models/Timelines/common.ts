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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  PointElement
);

export const commonTimelineChartOptions = mergeOptions(
  getCommonLineChartOptions(false),
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
