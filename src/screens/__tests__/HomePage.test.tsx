import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../HomePage';

describe('HomePage', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('Home Page')).toBeTruthy();
  });

  // Add more tests as you add functionality
  // Example:
  // it('handles button press', () => {
  //   const { getByTestId } = render(<HomePage />);
  //   const button = getByTestId('my-button');
  //   fireEvent.press(button);
  //   // Add assertions here
  // });
}); 