import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import PrivacyPolicy from '../../components/PrivacyPolicy';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

describe('PrivacyPolicy Component', () => {
  it('renders privacy policy correctly', () => {
    const { getAllByText, getByA11yLabel } = render(
      <PaperProvider>
        <PrivacyPolicy navigation={mockNavigation} />
      </PaperProvider>
    );

    expect(getAllByText('Privacy').length).toBeGreaterThan(0);

    // const backButton = getByA11yLabel('Go back'); 
    // backButton.props.onPress();

    // expect(mockGoBack).toHaveBeenCalled();
  });
});