import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS =
    ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#7B68EE'];

//@ts-ignore
const prepareChartData = (restaurant) => {
  //@ts-ignore
  return restaurant.categories.map(category => ({
    name: category.name,
    value: category.dishes.length // Number of dishes in each category
  }));
};

// Example restaurant object
const restaurant =
const TotalRestaurants = () => {
  const chartData = prepareChartData(restaurant);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label // Optional: to show labels for each slice
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default TotalRestaurants;
