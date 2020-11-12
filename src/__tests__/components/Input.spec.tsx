import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Input from '../../components/input';

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    }),
  };
});

describe('Input Component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="e-mail" placeholder="e-mail" />,
    );

    expect(getByPlaceholderText('e-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="e-mail" />,
    );

    const inputElement = getByPlaceholderText('e-mail');
    const inputContainer = getByTestId('inputContainer');

    // On Focus
    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });

    // On Blur
    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="e-mail" />,
    );

    const inputElement = getByPlaceholderText('e-mail');
    const inputContainer = getByTestId('inputContainer');

    fireEvent.change(inputElement, {
      target: {
        value: 'johndoe@example.com',
      },
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });
});