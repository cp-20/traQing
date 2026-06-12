import type { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';

export const mergeOptions = <T extends ChartOptions, K extends ChartOptions>(opt1: T, opt2: K): T & K =>
  deepmerge(opt1, opt2) as T & K;

export const commonChartOptions = {
  font: {
    family: 'Noto Sans JP',
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      border: {
        color: 'rgba(134, 142, 150, 0.35)',
      },
      grid: {
        color: 'rgba(134, 142, 150, 0.16)',
        display: false,
      },
      ticks: {
        color: '#868e96',
        font: { size: 12 },
      },
    },
    y: {
      border: {
        color: 'rgba(134, 142, 150, 0.35)',
      },
      grid: {
        color: 'rgba(134, 142, 150, 0.16)',
        display: true,
      },
      ticks: {
        color: '#868e96',
        font: { size: 12 },
      },
    },
  },
} satisfies ChartOptions;

export const commonBarChartOptions = mergeOptions(commonChartOptions, {
  elements: {
    bar: {
      borderWidth: 1,
      borderColor: '#74c0fc',
      backgroundColor: '#228be633',
    },
  },
}) satisfies ChartOptions;

export const getCommonLineChartOptions = (fill: boolean) =>
  mergeOptions(commonChartOptions, {
    elements: {
      line: {
        borderWidth: 1,
        borderColor: '#74c0fc',
        backgroundColor: '#228be633',
        fill,
      },
      point: {
        radius: 2,
        hoverRadius: 5,
        backgroundColor: '#74c0fc',
        hitRadius: 10,
      },
    },
  }) satisfies ChartOptions;
