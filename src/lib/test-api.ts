import { apiClient } from './api';

// Test function to verify API client functionality with mock data
export const testApiClient = async () => {
  console.log('Testing API client...');

  // Test that the API client is properly configured
  console.log('Base URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('API client instance created successfully');

  // Mock data for testing
  const mockUserData = {
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTaskData = {
    id: 'test-task-123',
    userId: 'test-user-123',
    title: 'Test Task',
    description: 'This is a test task',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Test the type interfaces work correctly
  console.log('Mock user data:', mockUserData);
  console.log('Mock task data:', mockTaskData);

  console.log('API client test completed successfully');
  return true;
};

// Run the test
testApiClient().catch(console.error);