import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreditCard from './CreditCard';
import '@testing-library/jest-dom';

describe('CreditCard', () => {
  it('renders the credit card and triggers delete confirmation', () => {
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <CreditCard
        name="John Doe"
        brand="Visa"
        last4="1234"
        exp_month={12}
        exp_year={25}
        id="card-1"
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Simulate clicking the delete icon
    fireEvent.click(screen.getByTestId('delete-icon'));

    // The confirmation popup should appear
    expect(screen.getByText(/components.CreditCard.msg/)).toBeInTheDocument();
    
    // Simulate clicking the confirm button
    fireEvent.click(screen.getByText('common.confirm'));

    // Ensure that the delete function was called
    expect(mockOnDelete).toHaveBeenCalledWith('card-1');
  });
});
