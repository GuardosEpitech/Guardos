import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserSupportPage from './UserSupportPage';

const mockNavigate = jest.fn();

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockNavigate,
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('@src/services/permissionsCalls', () => ({
  getRestoUserPermission: jest.fn(() => Promise.resolve(['premiumUser'])),
}));

describe('UserSupportPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (axios as jest.Mocked<typeof axios>).post
      .mockResolvedValue({});
  });

  it('renders the UserSupportPage form', () => {
    render(<UserSupportPage />);

    expect(screen.getByLabelText('pages.UserSupport.name'))
      .toBeInTheDocument();
    expect(screen.getByLabelText('pages.UserSupport.subject'))
      .toBeInTheDocument();
    expect(screen.getByLabelText('pages.UserSupport.request'))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.submit' }))
      .toBeInTheDocument();
  });

  it('validates form inputs and shows error messages', async () => {
    render(<UserSupportPage />);

    fireEvent.click(screen.getByRole('button', { name: 'common.submit' }));

    await waitFor(() => {
      expect(screen.getAllByText('pages.UserSupport.require-field').length)
        .toEqual(3);
    });
  });

  it('handles form submission successfully', async () => {
    render(<UserSupportPage />);

    fireEvent.change(screen.getByLabelText('pages.UserSupport.name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('pages.UserSupport.subject'), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByLabelText('pages.UserSupport.request'), {
      target: { value: 'This is a test request.' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'common.submit' }));

    await waitFor(() => {
      expect(screen.getByText('pages.UserSupport.email-sent-success'))
        .toBeInTheDocument();
    });
  });
});
