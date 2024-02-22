import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Chat from '../../components/Chat';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';

const WIDTH = 200;
const HEIGHT = 2000;

jest.mock('expo-file-system', () => ({
    readAsStringAsync: jest.fn(),
}));

jest.mock('expo-asset', () => ({
    Asset: {
        loadAsync: jest.fn(() => Promise.resolve([{ localUri: 'mockedLocalUri' }])),
    },
}));

async function setup() {
    const utils = render(<Chat />);
    const { getByText, queryByText } = utils;
    await waitFor(() => {
        expect(getByText('Loading...')).toBeTruthy();
    });

    await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
    });

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
        const { getByText } = await setup();
        await waitFor(() => {
            expect(getByText('Hello')).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('should add a new message when send is triggered', async () => {
        const { getByPlaceholderText, getByText, findByText } = await setup();
        const input = getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent.press(getByText('Send'));

        const newMessage = await findByText('New message');
        expect(newMessage).toBeTruthy();
    });

    it('should generate a response after adding a message', async () => {
        const { getByPlaceholderText, getByText } = await setup();
        const input = getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent.press(getByText('Send'));
        await waitFor(() => {
            const responseMessage = getByText('sample response');
            expect(responseMessage).toBeTruthy();
        }, { timeout: 3000 });
    });
});
