import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { getCommonLineChartOptions, mergeOptions } from '@/lib/commonChartOptions';

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
  target: 'count',
  groupBy: 'month',
  orderBy: 'date',
  order: 'asc',
} satisfies MessagesQuery & StampsQuery;
