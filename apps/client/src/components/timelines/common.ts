import { getCommonLineChartOptions, mergeOptions } from '@/lib/commonChartOptions';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
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

export const timelineCommonQuery = {
  groupBy: 'month',
  orderBy: 'date',
  order: 'asc',
} satisfies MessagesQuery & StampsQuery;
