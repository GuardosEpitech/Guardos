import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";
import { useTranslation } from "react-i18next";

// Mocking the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Return the key as the translation for simplicity
  })
}));

describe('LoadingScreen Component', () => {
  test('should render loading spinner and loading text', () => {
    // Render the component
    render(<LoadingScreen />);
    
    // Check if the spinner div is rendered using getByTestId
    const spinnerElement = screen.getByTestId('spinner');
    // expect(spinnerElement).toBeInTheDocument();
    
    // Check if the loading text is rendered
    const loadingText = screen.getByText('pages.Loading.loading-text');
    // expect(loadingText).toBeInTheDocument();
  });
});
