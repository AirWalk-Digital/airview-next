import React from 'react';
import { PieChart } from './PieChart';

export default {
  title: 'Widgets/PieChart',
  component: PieChart,
};

const defaultData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
      ],
      hoverOffset: 4,
    },
  ],
};

const defaultOptions = {
  radius: '75%',
};

const Template = (args) => <PieChart {...args} />;

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
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
      },
    ],
  },
  options: defaultOptions,
};
