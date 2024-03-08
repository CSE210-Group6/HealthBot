import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Setting from '../../components/Setting';
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
const mockNavigate = jest.fn();

const mockNavigation = {
    goBack: jest.fn(),
    navigate: mockNavigate,
};

// Mock PreferencesContext
const mockToggleTheme = jest.fn();
const mockContextValue = {
    toggleTheme: mockToggleTheme,
    isThemeDark: false,
};

// Mock props for Setting component
const mockProps = {
    navigation: mockNavigation,
    updateHistory: jest.fn(async () => { }),
    signout: jest.fn(),
};


describe('Setting', () => {
    it('calls updateHistory on cleaning chat history', async () => {
        const { getByText } = render(
            <PaperProvider value={mockContextValue}>
                <Setting {...mockProps} />
            </PaperProvider>
        );

        fireEvent.press(getByText('Clean Chat History'));
        fireEvent.press(getByText('Yes')); 

        expect(mockProps.updateHistory).toHaveBeenCalled();
    });

    it('calls signout on logout', () => {
        const { getByText } = render(
            <PaperProvider value={mockContextValue}>
                <Setting {...mockProps} />
            </PaperProvider>
        );

        fireEvent.press(getByText('Log out'));
        fireEvent.press(getByText('Yes'));

        expect(mockProps.signout).toHaveBeenCalled();
    });

    it('navigates to SelectAvatar page on "Change Avatar" press', () => {
        const { getByText } = render(
          <PaperProvider value={mockContextValue}>
            <Setting navigation={mockNavigation} {...mockProps} />
          </PaperProvider>
        );
    
        fireEvent.press(getByText('Change Avatar'));
        expect(mockNavigate).toHaveBeenCalledWith('SelectAvatar');
      });
    
      it('navigates to About page on "About" press', () => {
        const { getByText } = render(
          <PaperProvider value={mockContextValue}>
            <Setting navigation={mockNavigation} {...mockProps} />
          </PaperProvider>
        );
    
        fireEvent.press(getByText('About'));
        expect(mockNavigate).toHaveBeenCalledWith('About');
      });
});
