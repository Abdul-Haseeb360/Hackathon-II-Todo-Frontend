/**
 * API service layer for chatbot functionality
 */

interface ChatRequest {
  message: string;
  conversation_id?: number;
  metadata?: Record<string, any>;
}

interface ChatResponse {
  response: string;
  conversation_id: number;
  status: string;
  tool_calls?: Array<any>;
  tool_results?: Array<any>;
}

// Get the API base URL from environment or default to current origin (consistent with main API client)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Function to send a message to the chat API
 * @param message The message to send
 * @param conversationId Optional conversation ID to continue existing conversation
 * @returns Promise resolving to the chat response
 */
export const chatAPI = {
  /**
   * Send a message to the AI chatbot
   */
  sendMessage: async (message: string, conversationId?: number): Promise<ChatResponse> => {
    try {
      // Get the JWT token from localStorage (same as main API client)
      const token = localStorage.getItem('auth_token'); // Consistent with main API client

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        } as ChatRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get user's conversations
   */
  getUserConversations: async (): Promise<{ conversations: Array<any> }> => {
    try {
      const token = localStorage.getItem('auth_token'); // Consistent with main API client

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (conversationId: number): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem('auth_token'); // Consistent with main API client

      const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};