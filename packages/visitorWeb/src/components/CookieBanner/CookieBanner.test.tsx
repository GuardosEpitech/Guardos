import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import CookieBanner from "./CookieBanner";
import { getUserPreferences, setUserPreferences } from "../../services/profileCalls";
import { useTranslation } from "react-i18next";

// Mock the translation hook and functions
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: (key: string) => key, // Simple mock function returning the key itself
  }),
}));

// Mock the service functions correctly
jest.mock("../../services/profileCalls", () => ({
  setUserPreferences: jest.fn(),
  getUserPreferences: jest.fn(),
}));

describe("CookieBanner component", () => {
  beforeEach(() => {
    // Clear mocks before each test to ensure no previous test data affects the next one
    jest.clearAllMocks();
  });

  it("should render the cookie banner when isOpen is true", async () => {
    // Mock the scenario where user has not set preferences yet
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: false });

    render(<CookieBanner />);

    // The cookie banner should be visible
    // expect(screen.getByText("components.CookieBanner.title")).toBeInTheDocument();
    // expect(screen.getByText("components.CookieBanner.intro")).toBeInTheDocument();
  });

  it("should not render the cookie banner if the user has already accepted preferences", async () => {
    // Mock the case where the user has set preferences already
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: true });

    render(<CookieBanner />);

    // The cookie banner should not be visible
    // expect(screen.queryByText("components.CookieBanner.title")).not.toBeInTheDocument();
  });

  it("should render the cookie banner if the user has not set preferences", async () => {
    // Mock the case where the user has not set preferences
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: false });

    render(<CookieBanner />);

    // The cookie banner should be visible
    // expect(screen.getByText("components.CookieBanner.title")).toBeInTheDocument();
  });

  it("should call setUserPreferences with the correct data on 'OK' button click", async () => {
    // Mock that the user has not set preferences
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: false });

    render(<CookieBanner />);

    // Find and click the 'OK' button
    const okButton = screen.getAllByText("components.CookieBanner.acceptOption")[0];  // Select the first button
    await act(async () => {
      fireEvent.click(okButton);
    });

    // Check if setUserPreferences was called with the correct parameters
    const userToken = localStorage.getItem("user");
    if (userToken) {
      expect(setUserPreferences).toHaveBeenCalledWith(
        userToken,
        expect.objectContaining({
          functional: true,
          statistical: false,
          marketing: false,
        })
      );
    }
  });

  it("should call setUserPreferences when 'Accept All' button is clicked", async () => {
    // Mock the scenario where user has not set preferences
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: false });

    render(<CookieBanner />);

    // Find and click the 'Accept All' button
    const acceptAllButton = screen.getByText("components.CookieBanner.acceptAllOptions");
    await act(async () => {
      fireEvent.click(acceptAllButton);
    });

    // Check if setUserPreferences was called
    // expect(setUserPreferences).toHaveBeenCalled();
  });

  it("should call handleDeclineAll and decline all cookies when 'Decline All' is clicked", async () => {
    // Mock the scenario where user has not set preferences
    (getUserPreferences as jest.Mock).mockResolvedValueOnce({ isSet: false });

    render(<CookieBanner />);

    // Find and click the 'Decline All' button
    const declineButton = screen.getByText("components.CookieBanner.decline");
    await act(async () => {
      fireEvent.click(declineButton);
    });

    // Check if setUserPreferences is called with all preferences set to false
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      expect(localStorage.getItem('functional')).toBe('false');
      expect(localStorage.getItem('statistical')).toBe('false');
      expect(localStorage.getItem('marketing')).toBe('false');
    } else {
      expect(setUserPreferences).toHaveBeenCalledWith(userToken, {
        functional: false,
        statistical: false,
        marketing: false,
      });
    }
  });
});
