import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechnologyPage from './TechnologyPage';

import {useTranslation} from 'react-i18next';

// jest.mock('react-i18next');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => ['key'] }),
  Trans: () => jest.fn(),
  t: () => jest.fn(),
}));

describe('TechnologyPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock data if present
  });

  test('renders the page title', () => {
    const {container} = render(
      <TechnologyPage />
    );

    const tables = container.getElementsByTagName('table');

    expect(tables.length)
      .toBeGreaterThan(0); // Verify there are tables
    expect(tables[0])
      .toBeInTheDocument(); // Verify the first table exists
  });
});
