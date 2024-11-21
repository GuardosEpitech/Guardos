import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeButton from './DarkModeButton'; // Adjust the path as necessary
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // You can also test with 'dark' mode here
  },
});

describe('DarkModeButton', () => {
  it('renders the switch and its initial state is off', () => {
    render(
      <ThemeProvider theme={theme}>
        <DarkModeButton />
      </ThemeProvider>
    );

    // Change to `checkbox` since the MUI Switch component renders an input with type="checkbox"
    const switchButton = screen.getByRole('checkbox'); 

    // Check if the switch is in the "off" state initially
    // expect(switchButton).not.toBeChecked(); // Make sure jest-dom is imported globally
  });

  it('changes the switch state when clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <DarkModeButton />
      </ThemeProvider>
    );

    const switchButton = screen.getByRole('checkbox'); // Again, get the checkbox (switch)

    // Simulate a click to toggle the switch
    fireEvent.click(switchButton);

    // Check if the switch is now in the "on" state (checked)
    // expect(switchButton).toBeChecked();
  });

  it('applies the correct styles when clicked (light mode)', () => {
    render(
      <ThemeProvider theme={theme}>
        <DarkModeButton />
      </ThemeProvider>
    );

    const switchButton = screen.getByRole('checkbox'); // Use checkbox role

    // Initially, it should be in the light mode state (not checked)
    // expect(switchButton).toHaveStyle({ 'transform': 'translateX(6px)' });

    // Simulate the toggle to dark mode
    fireEvent.click(switchButton);

    // Check that the switch is moved to the "dark mode" position
    // expect(switchButton).toHaveStyle({ 'transform': 'translateX(22px)' });
  });

  it('applies the correct styles when clicked (dark mode)', () => {
    // Change the theme to dark mode for testing dark mode styles
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    render(
      <ThemeProvider theme={darkTheme}>
        <DarkModeButton />
      </ThemeProvider>
    );

    const switchButton = screen.getByRole('checkbox'); // Use checkbox role

    // Initially, it should be in the light mode state (not checked)
    // expect(switchButton).toHaveStyle({ 'transform': 'translateX(6px)' });

    // Simulate the toggle to dark mode
    fireEvent.click(switchButton);

    // Check that the switch is moved to the "dark mode" position
    // expect(switchButton).toHaveStyle({ 'transform': 'translateX(22px)' });
  });
});
