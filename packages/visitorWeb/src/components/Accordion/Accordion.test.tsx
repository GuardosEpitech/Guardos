// Accordion.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Accordion from "./Accordion";
import "@testing-library/jest-dom"; // for the 'toBeInTheDocument' matcher

describe("Accordion component", () => {
  it("should render with the provided title", () => {
    render(<Accordion title="Test Accordion">Some content</Accordion>);
    expect(screen.getByText("Test Accordion")).toBeInTheDocument();
  });

  it("should toggle the content visibility when clicked", () => {
    render(<Accordion title="Test Accordion">Some content</Accordion>);

    // Initially, the content should not be visible
    expect(screen.queryByText("Some content")).toBeNull();

    // Click to open the accordion
    fireEvent.click(screen.getByText("Test Accordion"));

    // Content should be visible now
    expect(screen.getByText("Some content")).toBeInTheDocument();

    // Click again to close the accordion
    fireEvent.click(screen.getByText("Test Accordion"));

    // Content should be hidden again
    expect(screen.queryByText("Some content")).toBeNull();
  });

  it("should render the accordion header with the 'active' class when open", () => {
    render(<Accordion title="Test Accordion">Some content</Accordion>);
    
    const header = screen.getByText("Test Accordion");
    
    // Initially, header should not have 'active' class
    expect(header).not.toHaveClass("active");

    // Click to open the accordion
    fireEvent.click(header);
  });
});
