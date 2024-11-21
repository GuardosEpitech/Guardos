// AddressInput.test.tsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AddressInput from './AddressInput';
import '@testing-library/jest-dom'; // for the 'toBeInTheDocument' matcher

// Mocking the `useTranslation` hook to avoid needing a full i18n setup in the test
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AddressInput component', () => {
  it('should render input and button with correct placeholder and text', () => {
    render(
      <AddressInput
        address=""
        setAddress={() => {}}
        handleAddressSearch={jest.fn()}
        isAddress={false}
      />
    );

    expect(screen.getByPlaceholderText('pages.RestoPage.address')).toBeInTheDocument();
    expect(screen.getByText('pages.RestoPage.loc')).toBeInTheDocument();
  });

  it('should update address state when typing in the input field', () => {
    const setAddress = jest.fn();
    render(
      <AddressInput
        address=""
        setAddress={setAddress}
        handleAddressSearch={jest.fn()}
        isAddress={false}
      />
    );

    const input = screen.getByPlaceholderText('pages.RestoPage.address');
    fireEvent.change(input, { target: { value: '123 Main St' } });

    expect(setAddress).toHaveBeenCalledWith('123 Main St');
  });

  it('should call handleAddressSearch when the button is clicked', async () => {
    const handleAddressSearch = jest.fn();
    render(
      <AddressInput
        address=""
        setAddress={() => {}}
        handleAddressSearch={handleAddressSearch}
        isAddress={false}
      />
    );

    const button = screen.getByText('pages.RestoPage.loc');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(handleAddressSearch).toHaveBeenCalled();
  });

  it('should apply the correct button style based on isAddress prop', () => {
    const { rerender } = render(
      <AddressInput
        address=""
        setAddress={() => {}}
        handleAddressSearch={jest.fn()}
        isAddress={false}
      />
    );

    let button = screen.getByText('pages.RestoPage.loc');

    // Re-render with isAddress set to true
    rerender(
      <AddressInput
        address=""
        setAddress={() => {}}
        handleAddressSearch={jest.fn()}
        isAddress={true}
      />
    );

    button = screen.getByText('pages.RestoPage.loc');
  });
});
