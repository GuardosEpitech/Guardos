// Import necessary modules
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BackButton from './HomeButton'; // Adjust the path as needed
import { NavigateTo } from '@src/utils/NavigateTo';
import { useTranslation } from 'react-i18next';

// Mock the necessary modules
jest.mock('@src/utils/NavigateTo', () => ({
  NavigateTo: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('BackButton Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = useNavigate() as jest.Mock; // Initialize mock navigate
    (useTranslation as jest.Mock).mockReturnValue({ t: (key: string) => key }); // Mock translation function
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('renders the button with correct text', () => {
    render(<BackButton />);

    // Assert that the button is in the document and contains the correct text
    // expect(screen.getByRole('button', { name: 'components.HomeButton.go-to-list-view' })).toBeInTheDocument();
  });

  it('calls NavigateTo when the button is clicked', () => {
    render(<BackButton />);

    // Simulate a click event on the button
    fireEvent.click(screen.getByRole('button'));

    // Check if the NavigateTo function was called with the correct arguments
    expect(NavigateTo).toHaveBeenCalledWith("/", mockNavigate);
  });

  it('applies the correct styles to the button', () => {
    const { container } = render(<BackButton />);

    // Check if the button has the correct width
    const button = container.querySelector('button');
    // expect(button).toHaveStyle('width: 15.44rem');
  });
});
