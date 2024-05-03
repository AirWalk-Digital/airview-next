import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data, options }) {
  return <Pie data={data} options={options} />;
}

export default PieChart;
