import { useState, useEffect } from 'react';
import { User } from '@/types';
import { signIn, signUp, signOut, isAuthenticated as checkAuth, getSession, refreshSession } from '@/lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authenticated = checkAuth();
        if (authenticated) {
          const session = getSession();
          setAuthState({
            user: session?.user || null,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to check authentication status',
          isAuthenticated: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await signIn(email, password);

      if (result.success) {
        const session = getSession();
        setAuthState({
          user: session?.user || result.user as User,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Login failed',
        }));
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'An error occurred during login',
        isAuthenticated: false,
      });
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await signUp(email, password, name);

      if (result.success) {
        const session = getSession();
        setAuthState({
          user: session?.user || result.user as User,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Registration failed',
        }));
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'An error occurred during registration',
        isAuthenticated: false,
      });
      return { success: false, error: error.message || 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const result = await signOut();

      if (result.success) {
        setAuthState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Logout failed',
        }));
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred during logout',
      }));
    }
  };

  // Function to refresh the session
  const refreshAuth = () => {
    refreshSession();
    const session = getSession();
    if (session) {
      setAuthState(prev => ({
        ...prev,
        user: session.user,
        isAuthenticated: true,
      }));
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshAuth,
  };
};

export default useAuth;