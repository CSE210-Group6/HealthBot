import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import App from '../App';

describe('App', () => {
    it('renders the Login screen as the initial route', () => {
        const { getByText } = render(<App />);
        expect(getByText('Login')).toBeTruthy();
    });

    it('navigates to Home screen on login', async () => {
        const { findByTestId, getByPlaceholderText,getAllByText, getByText, getByLabelText } = render(<App />);

        fireEvent.changeText(getByLabelText('Username'), 'testUser');
        fireEvent.changeText(getByLabelText('Password'), 'testPass');
        fireEvent.press(getByText('Login'));
        
        await waitFor(() => {
            expect(getAllByText('Chat').length).toBeGreaterThan(0);
            expect(getAllByText('Chat')[0]).toBeTruthy();
        }, { timeout: 3000 });
    });

});
