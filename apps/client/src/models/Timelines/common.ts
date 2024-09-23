import { getCommonLineChartOptions, mergeOptions } from '@/models/commonChartOptions';
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Tooltip, PointElement);

export const commonTimelineChartOptions = mergeOptions(getCommonLineChartOptions(false), {
  plugins: {
    tooltip: {
      enabled: true,
      axis: 'y',
      displayColors: false,
    },
  },
}) satisfies ChartOptions;
