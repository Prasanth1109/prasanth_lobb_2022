// apiClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_POST_URL = 'https://swsut62sse.execute-api.ap-south-1.amazonaws.com/prod';
const API_GET_URL = 'https://tzab40im77.execute-api.ap-south-1.amazonaws.com/prod';

// Core request function
const request = async (url: string, method: string, body?: any) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    // Status code handling
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('Bad Request: Check your input.');
        case 401:
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized: Please login again.');
        case 403:
          throw new Error('Forbidden: Access denied.');
        case 404:
          throw new Error('Not Found: Resource does not exist.');
        case 500:
          throw new Error('Server Error: Try again later.');
        default:
          throw new Error(`Unexpected Error (${response.status}): ${responseData}`);
      }
    }

    return responseData;
  } catch (error: any) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// Specific API calls
export const generateToken = async (email: string) => {
  return request(`${API_POST_URL}/generateToken`, 'POST', { email });
};

export const getContent = async () => {
  return request(`${API_GET_URL}/getContent`, 'GET');
};
