import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Setting from '../../components/Setting';
import Chat from '../../components/Chat';
import { TEST_ID } from 'react-native-gifted-chat/lib/Constant';
import {
    PaperProvider
} from 'react-native-paper';

import SelectAvatar from '../../components/SelectAvatar';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

jest.mock('expo-image-manipulator', () => ({
    manipulateAsync: jest.fn(),
    SaveFormat: {
        JPEG: 'JPEG',
    },
}));


describe('SelectAvatar Component', () => {
    const mockHandleUpdateAvatar = jest.fn();
    const mockNavigation = { navigate: jest.fn() };

    beforeEach(() => {
        ImagePicker.launchImageLibraryAsync.mockReset();
        ImageManipulator.manipulateAsync.mockReset();
        mockHandleUpdateAvatar.mockReset();
    });

    it('picks and compresses an image, then updates avatar', async () => {
        const fakeImageUri = 'file:///fakepath/fakeImage.jpg';
        const fakeCompressedBase64 = 'fakeCompressedBase64String';

        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
            cancelled: false,
            assets: [{ uri: fakeImageUri }],
        });
        ImageManipulator.manipulateAsync.mockResolvedValue({
            base64: fakeCompressedBase64,
        });

        const { getByText } = render(
            <PaperProvider><SelectAvatar
                handleupdateAvatar={mockHandleUpdateAvatar}
                navigation={mockNavigation}
                avatar="initialAvatarUri"
            /></PaperProvider>
        );

        const uploadButton = getByText('Upload Image');
        fireEvent.press(uploadButton);

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
            expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
                fakeImageUri,
                [{ resize: { width: 50 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            expect(mockHandleUpdateAvatar).toHaveBeenCalledWith(
                `data:image/jpeg;base64,${fakeCompressedBase64}`,
                mockNavigation
            );
        });
    });

});