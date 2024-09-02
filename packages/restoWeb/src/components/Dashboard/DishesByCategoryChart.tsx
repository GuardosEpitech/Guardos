import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
//@ts-ignore
const dishesByCategory = restoStatistics.flatMap(resto => resto.categories) //@ts-ignore
  .reduce((acc, category) => {
    const name = category.name;
    acc[name] = (acc[name] || 0) + category.dishes.length;
    return acc;
  }, {});

const categoryData = Object.keys(dishesByCategory)
  .map(key => ({ name: key, value: dishesByCategory[key] }));

const DishesByCategoryChart = () => (
  <BarChart width={600} height={300} data={categoryData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
);

export default DishesByCategoryChart;
