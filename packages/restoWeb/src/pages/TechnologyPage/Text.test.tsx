import { render, screen, cleanup } from "@testing-library/react";
import React from 'react';

// Importing the jest testing library
import '@testing-library/jest-dom';
import { Text } from "./Text";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Text Component", () => {

  // Test 1
  test("Text Rendering", () => {
    render(<Text />);
    const text = screen.getByTestId("text");
    expect(text)
      .toBeInTheDocument();
  });
});
