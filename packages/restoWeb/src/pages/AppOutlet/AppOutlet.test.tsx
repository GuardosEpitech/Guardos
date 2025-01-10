// import { expect, it, describe } from '@jest/globals';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppOutlet from './AppOutlet';

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
  initReactI18next: {
    type: '3rdParty',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init: () => {},
  },
  t: () => jest.fn(),
}));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// eslint-disable-next-line react/display-name
jest.mock('../../components/dumpComponents/Header/Header', () => () =>
  <div>Mock Header</div>);

describe('AppOutlet', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const renderWithRouter = (ui: any) => {
    return render(<Router>{ui}</Router>);
  };

  it('should render successfully', () => {
    expect(true)
      .toBe(true);
  });

  it('renders Header and Outlet components', () => {
    renderWithRouter(<AppOutlet />);
    expect(screen.getByText('Mock Header'))
      .toBeInTheDocument();
  });

  it('renders contact information correctly', () => {
    renderWithRouter(<AppOutlet />);
    expect(screen.getByText('pages.AppOutlet.contact'))
      .toBeInTheDocument();
    expect(screen.getByText('pages.AppOutlet.email'))
      .toBeInTheDocument();
    expect(screen.getByText('pages.AppOutlet.location'))
      .toBeInTheDocument();
  });

  it('navigates to correct pages when links are clicked', () => {
    renderWithRouter(<AppOutlet />);
    fireEvent.click(screen.getByText('pages.AppOutlet.terms'));
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/terms');

    fireEvent.click(screen.getByText('pages.AppOutlet.privacy'));
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/privacy');

    fireEvent.click(screen.getByText('pages.AppOutlet.imprint'));
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/imprint');

    fireEvent.click(screen.getByText('pages.AppOutlet.cookieStatement'));
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/cookiestatement');
  });

  it('renders external link for visitor intro page correctly', () => {
    process.env.VISITOR_INTRO_URL = 'https://example.com';
    renderWithRouter(<AppOutlet />);
    const externalLink = screen.getByText('pages.AppOutlet.welcomeSite')
      .closest('a');
    expect(externalLink)
      .toHaveAttribute('href', 'https://example.com/intropage');
    expect(externalLink)
      .toHaveAttribute('target', '_blank');
    expect(externalLink)
      .toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders footer icons with alt text', () => {
    renderWithRouter(<AppOutlet />);
    const instagramIcon = screen.getByAltText('pages.AppOutlet.instagram');
    expect(instagramIcon)
      .toBeInTheDocument();

    const linkedInIcon = screen.getByAltText('pages.AppOutlet.linkedIn');
    expect(linkedInIcon)
      .toBeInTheDocument();
  });

  it('renders trademark text', () => {
    renderWithRouter(<AppOutlet />);
    expect(screen.getByText('pages.AppOutlet.tradeMark'))
      .toBeInTheDocument();
  });
});
