import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
}));

describe('App', () => {
    it('renders the Login screen as the initial route', () => {
        const { getByText } = render(<App />);
        expect(getByText('Login')).toBeTruthy();
    });

    it('navigates to Home screen on login', async () => {
        const { findByTestId, getByPlaceholderText, getByText } = render(<App />);

        fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
        fireEvent.changeText(getByPlaceholderText('Password'), 'testPass');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(getByText('Loading...')).toBeTruthy();
        }, { timeout: 3000 });
    });

});
