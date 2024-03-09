import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Signup from '../../components/Signup';
import Chat from '../../components/Chat';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import {
    PaperProvider
} from 'react-native-paper';

const WIDTH = 200;
const HEIGHT = 2000;

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
}));


describe('Signup', () => {
    it('renders the Signup form correctly', async () => {
        const { getByPlaceholderText, getByText, getByLabelText } = render(<Signup />);

        await waitFor(() => {
            expect(getByLabelText('Username')).toBeTruthy();
            expect(getByLabelText('Password')).toBeTruthy();
            expect(getByText('Signup')).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('calls handleSignup on button press with username and password', () => {
        const handleSignupMock = jest.fn();
        const { getByText } = render(<Signup handleSignup={handleSignupMock} />);

        fireEvent.press(getByText('Signup'));
        expect(handleSignupMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), undefined);
    });

    it('displays notification when passed through props', () => {
        const notificationMessage = 'Signup failed';
        const { getByText } = render(<Signup signupNotification={notificationMessage} />);
        expect(getByText(notificationMessage)).toBeTruthy();
    });
});
