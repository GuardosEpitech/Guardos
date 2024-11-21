import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import TermsPage from './T&CPage';

import {useTranslation} from 'react-i18next';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: () => ['key'] }),
    Trans: () => jest.fn(),
    t: () => jest.fn(),
  }));


describe('TermsPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any mock data if present
      });

      test('renders the page title', () => {
        const {container} = render(
          <TermsPage />
        );
    
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1); // Verify the first table exists
      });
});
