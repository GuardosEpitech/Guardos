import React from "react";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = {
  primary: '#FF5733',
  secondary: '#33FF57',
  // Weitere Farben hier hinzufügen
};

//@ts-ignore
// eslint-disable-next-line max-len
const allergenFrequency = restoStatistics.flatMap(resto => resto.products.flatMap(product => product.allergens))//@ts-ignore
  .reduce((acc, allergen) => {
    acc[allergen] = (acc[allergen] || 0) + 1;
    return acc;
  }, {});

const allergenData = Object.keys(allergenFrequency)
  .map(key => ({ name: key, value: allergenFrequency[key] }));

// @ts-ignore
const AllergenChart = () => (
  <PieChart width={400} height={400}>
    <Pie
      data={allergenData}
      cx={200}
      cy={200}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {allergenData.map((entry, index) => (
        // @ts-ignore
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
);

export default AllergenChart;
