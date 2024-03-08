import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../components/Login';
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


describe('Login', () => {
    it('renders the login form correctly', async () => {
        const { getByPlaceholderText, getByText, getByLabelText } = render(<Login />);

        await waitFor(() => {
            expect(getByLabelText('Username')).toBeTruthy();
            expect(getByLabelText('Password')).toBeTruthy();
            expect(getByText('Login')).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('calls handleLogin on button press with username and password', () => {
        const handleLoginMock = jest.fn();
        const { getByText } = render(<Login handleLogin={handleLoginMock} />);

        fireEvent.press(getByText('Login'));
        expect(handleLoginMock).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    it('renders Chat component when home prop is true', async () => {
        const { getAllByText, getByTestId } = render(<PaperProvider><Login home={true} /></PaperProvider>);
        const loadingWrapper = getByTestId(TEST_ID.LOADING_WRAPPER)
        fireEvent(loadingWrapper, 'layout', {
            nativeEvent: {
                layout: {
                    width: WIDTH,
                    height: HEIGHT,
                },
            },
        });
        await waitFor(() => {
            expect(getAllByText('No messages yet').length).toBeGreaterThan(0);
            expect(getAllByText('No messages yet')[0]).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('displays notification when passed through props', () => {
        const notificationMessage = 'Login failed';
        const { getByText } = render(<Login notification={notificationMessage} />);
        expect(getByText(notificationMessage)).toBeTruthy();
    });
});
