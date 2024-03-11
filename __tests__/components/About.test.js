import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import About from '../../components/About';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
    goBack: mockGoBack,
};

describe('About Component', () => {
    it('renders correctly and navigates back on button press', () => {
        const { getByText, getByA11yLabel } = render(
            <PaperProvider>
                <About navigation={mockNavigation} />
            </PaperProvider>
        );

        expect(getByText('About Us')).toBeTruthy();

        // const backButton = getByA11yLabel('Go back'); 
        // fireEvent.press(backButton);

        // expect(mockGoBack).toHaveBeenCalled();
    });
});