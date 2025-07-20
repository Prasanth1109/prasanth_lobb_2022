import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getContent } from '../../utils/apiClient';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../../utils/apiClient', () => ({
  getContent: jest.fn(),
}));

jest.mock('../../utils/methods', () => ({
  getInitials: jest.fn(() => 'HS'),
}));

describe('HomeScreen Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (getContent as jest.Mock).mockResolvedValueOnce({ content: null });
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('renders fetched content', async () => {
    (getContent as jest.Mock).mockResolvedValueOnce({
      content: {
        userName: 'Luffy',
        mainImage: 'main.jpg',
        thumbNailImage: 'thumb.jpg',
        subTitle: 'Pirate King',
        text: 'One Piece content',
        logo: 'logo.jpg',
        title: 'One Piece',
      },
    });

    const { getByText, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(queryByTestId('ActivityIndicator')).toBeNull());
    expect(getByText('One Piece')).toBeTruthy();
    expect(getByText('Pirate King')).toBeTruthy();
  });

  it('handles refresh button click', async () => {
    (getContent as jest.Mock).mockResolvedValue({
      content: {
        userName: 'Zoro',
        mainImage: 'main.jpg',
        thumbNailImage: 'thumb.jpg',
        subTitle: 'Swordsman',
        text: 'Wano arc',
        logo: 'logo.jpg',
        title: 'One Piece',
      },
    });

    const { getByTestId, getByText } = render(<HomeScreen />);
    await waitFor(() => getByText('One Piece'));
    fireEvent.press(getByTestId('refreshButton'));
    expect(getContent).toHaveBeenCalledTimes(2);
  });

  it('navigates to Login on Logout', async () => {
    (getContent as jest.Mock).mockResolvedValue({
      content: {
        userName: 'Sanji',
        mainImage: 'main.jpg',
        thumbNailImage: 'thumb.jpg',
        subTitle: 'Cook',
        text: 'All Blue',
        logo: 'logo.jpg',
        title: 'One Piece',
      },
    });

    const { getByTestId, getByText } = render(<HomeScreen />);
    await waitFor(() => getByText('One Piece'));

    fireEvent.press(getByTestId('logoutButton'));
    await waitFor(() =>
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken')
    );
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to Details when card is pressed', async () => {
    const mockContent = {
      userName: 'Nami',
      mainImage: 'main.jpg',
      thumbNailImage: 'thumb.jpg',
      subTitle: 'Navigator',
      text: 'Weather Witch',
      logo: 'logo.jpg',
      title: 'One Piece',
    };
    (getContent as jest.Mock).mockResolvedValue({ content: mockContent });

    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => getByTestId('cardImageButton'));

    fireEvent.press(getByTestId('cardImageButton'));
    expect(mockNavigate).toHaveBeenCalledWith('Details', {
      title: mockContent.title,
      thumbNailImage: mockContent.thumbNailImage,
      logo: mockContent.logo,
      image: mockContent.mainImage,
      subTitle: mockContent.subTitle,
      text: mockContent.text,
    });
  });
});
