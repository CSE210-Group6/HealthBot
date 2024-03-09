import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import ThirdParty from '../../components/ThirdParty';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

describe('ThirdParty Component', () => {
  it('renders third-party licenses correctly', () => {
    const { getAllByText, getByA11yLabel } = render(
      <PaperProvider>
        <ThirdParty navigation={mockNavigation} />
      </PaperProvider>
    );

    expect(getAllByText('MIT Licenses').length).toBeGreaterThan(0);

    // const backButton = getByA11yLabel('Go back'); 
    // backButton.props.onPress();

    // expect(mockGoBack).toHaveBeenCalled();
  });
});