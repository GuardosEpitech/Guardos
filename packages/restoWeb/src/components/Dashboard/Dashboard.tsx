import React from 'react';
import { Grid } from '@mui/material';
import TotalRestaurants from './TotalRestaurants';
import AverageRatingChart from './AverageRatingChart';
import DishesByCategoryChart from './DishesByCategoryChart';
import AllergenChart from './AllergenChart';

const Dashboard = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TotalRestaurants />
    </Grid>
    <Grid item xs={12} sm={6}>
      <AverageRatingChart />
    </Grid>
    <Grid item xs={12} sm={6}>
      <DishesByCategoryChart />
    </Grid>
    <Grid item xs={12} sm={6}>
      <AllergenChart />
    </Grid>
  </Grid>
);

export default Dashboard;
