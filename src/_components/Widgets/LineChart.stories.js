import React from 'react';
import { LineChart } from './LineChart';

export default {
  title: 'Widgets/LineChart',
  component: LineChart,
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const defaultData = {
  labels,
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const defaultOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const Template = (args) => <LineChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: defaultData,
  options: defaultOptions,
};

export const CustomData = Template.bind({});
CustomData.args = {
  data: {
    ...defaultData,
    datasets: [
      {
        ...defaultData.datasets[0],
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(100, 99, 255, 0.2)',
      },
    ],
  },
  options: defaultOptions,
};
