import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, TodoTask, User } from '@/types';

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    console.log("API_URL used: ", process.env.NEXT_PUBLIC_API_URL);
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    // Always check localStorage for the most up-to-date token
    if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('auth_token');
      if (tokenFromStorage) {
        this.token = tokenFromStorage;
      }
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 403 Unauthorized - return specific error for handling in components
      if (response.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_session');
        }
        return {
          success: false,
          error: 'Unauthorized - please log in again',
          status: 403,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }


  // Task methods
  async getTasks(): Promise<ApiResponse<TodoTask[]>> {
    return this.request('/api/tasks');
  }

  async createTask(task: Omit<TodoTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TodoTask>> {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: Partial<TodoTask>): Promise<ApiResponse<TodoTask>> {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async toggleTaskCompletion(id: string): Promise<ApiResponse<TodoTask>> {
    return this.request(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();