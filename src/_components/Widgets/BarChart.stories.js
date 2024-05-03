import React from 'react';
import { BarChart } from './BarChart';

export default {
  title: 'Widgets/BarChart',
  component: BarChart,
};

const defaultData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
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
      text: 'Monthly Votes',
    },
  },
};

const Template = (args) => <BarChart {...args} />;

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
        data: [20, 15, 60, 20, 30], // Custom data points
        backgroundColor: 'rgba(100, 99, 255, 0.2)', // Custom color
      },
    ],
  },
  options: defaultOptions,
};
