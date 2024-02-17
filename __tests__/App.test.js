import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import App from '../App';

describe('App', () => {
    it('renders the Login screen as the initial route', () => {
        const { getByText } = render(<App />);
        expect(getByText('Login')).toBeTruthy();
    });

    it('navigates to Home screen on login', () => {
        const { findByTestId, getByPlaceholderText, getByText } = render(<App />);

        fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
        fireEvent.changeText(getByPlaceholderText('Password'), 'testPass');
        fireEvent.press(getByText('Login'));

        const homeScreen = findByTestId(TEST_ID.LOADING_WRAPPER);
        expect(homeScreen).toBeTruthy();
    });

});
