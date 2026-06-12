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
import type { DateRange } from '@/composables/useDateRangePicker';
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

export const getTimelineQuery = (range?: DateRange) =>
  ({
    target: 'count',
    groupBy: range && range[1].getTime() - range[0].getTime() <= 90 * 24 * 60 * 60 * 1000 ? 'day' : 'month',
    orderBy: 'date',
    order: 'asc',
  }) satisfies MessagesQuery & StampsQuery;
