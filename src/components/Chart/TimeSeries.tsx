import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { FC } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type TimeSeriesProps = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  showLegend?: boolean;
};

export const TimeSeries: FC<TimeSeriesProps> = ({
  labels,
  datasets,
  showLegend,
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: showLegend ?? false ? { position: 'top' } : undefined,
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <div className="w-1/2">
      <Line data={data} options={options} />
    </div>
  );
};
