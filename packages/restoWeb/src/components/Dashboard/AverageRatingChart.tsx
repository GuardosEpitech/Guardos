import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const averageRating  //@ts-ignore
    // eslint-disable-next-line max-len
    = restoStatistics.reduce((acc, resto) => acc + resto.rating, 0) / restoStatistics.length;

const AverageRatingChart = () => (
  <BarChart 
    width={600} height={300} 
    data={[{ name: 'Average Rating', value: averageRating }]}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#82ca9d" />
  </BarChart>
);

export default AverageRatingChart;
