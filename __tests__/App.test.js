import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import App from '../App';
import { Content } from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
}));

async function setup() {
    const handleLoginSpy = jest.spyOn(Content.prototype, 'handleLogin');
    handleLoginSpy.mockImplementation((username, password) => {});
    let utils = render(<App />);
    return {handleLoginSpy, ...utils};
}

describe('App', () => {
    it('renders the Login screen as the initial route', async () => {
        const { getByText } = await setup();
        expect(getByText('Login')).toBeTruthy();
    });

    it('navigates to Home screen on login', async () => {
        const { handleLoginSpy, findByTestId, getByPlaceholderText,getAllByText, getByText, getByLabelText } = await setup();

        fireEvent.changeText(getByLabelText('Username'), 'a');
        fireEvent.changeText(getByLabelText('Password'), '123');
        fireEvent.press(getByText('Login'));

        expect(handleLoginSpy).toHaveBeenCalled();
    });

});
