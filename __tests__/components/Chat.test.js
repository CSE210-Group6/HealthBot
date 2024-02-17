import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Chat from '../../components/Chat';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';

const WIDTH = 200;
const HEIGHT = 2000;

function setup() {
    const utils = render(<Chat />);
    const loadingWrapper = utils.getByTestId(TEST_ID.LOADING_WRAPPER)
    fireEvent(loadingWrapper, 'layout', {
        nativeEvent: {
            layout: {
                width: WIDTH,
                height: HEIGHT,
            },
        },
    });
    return utils;
}

describe('Chat', () => {
    it('should initialize with default message', async () => {
        const { getByText } = setup();
        await waitFor(() => {
            expect(getByText('Hello')).toBeTruthy();
        }, {timeout: 3000});
    });

    it('should add a new message when send is triggered', async () => {
        const { getByPlaceholderText, getByText, findByText } = setup();
        const input = getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent.press(getByText('Send'));

        const newMessage = await findByText('New message');
        expect(newMessage).toBeTruthy();
    });

    it('should generate a response after adding a message', async () => {
        const { getByPlaceholderText, getByText } = setup();
        const input = getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent.press(getByText('Send'));
        await waitFor(() => {
            const responseMessage = getByText('sample response');
            expect(responseMessage).toBeTruthy();
        }, {timeout: 3000});
    });
});
