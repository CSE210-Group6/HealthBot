import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Chat from '../../components/Chat';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import { PaperProvider } from 'react-native-paper';

const WIDTH = 200;
const HEIGHT = 2000;

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
}));

async function setup() {
    const chatBotRequestSpy = jest.spyOn(Chat.prototype, 'chatBotRequest');
    chatBotRequestSpy.mockImplementation(() => {
        return Promise.resolve('sample response');
    });
    let utils = render(<PaperProvider><Chat history={{}} messages={{}} updateHistory={() => jest.fn()}/></PaperProvider>);
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
        const { getAllByText } = await setup();
        await waitFor(() => {
            expect(getAllByText('No messages yet').length).toBeGreaterThan(0);
            expect(getAllByText('No messages yet')[0]).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('should add a new message when send is triggered', async () => {
        const { getByPlaceholderText, getByText, findByText, getByLabelText } = await setup();
        const input = await getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent(input, 'onSubmitEditing');

        const newMessage = await findByText('New message');
        expect(newMessage).toBeTruthy();
    });

    it('should generate a response after adding a message', async () => {
        const { getByPlaceholderText, getByText } = await setup();
        const input = getByPlaceholderText('Type a message...');
        fireEvent.changeText(input, 'New message');
        fireEvent(input, 'onSubmitEditing');
        await waitFor(() => {
            const responseMessage = getByText('sample response');
            expect(responseMessage).toBeTruthy();
        }, { timeout: 3000 });
    });
});
