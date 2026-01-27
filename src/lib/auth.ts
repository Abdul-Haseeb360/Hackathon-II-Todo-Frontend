// Session management functions
const SESSION_KEY = "auth_session";

// Store session data
export const storeSession = (userData: any, token: string) => {
  const sessionData = {
    user: userData,
    token,
    timestamp: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  // Store token in localStorage for API client
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

// Retrieve session data
export const getSession = () => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (error) {
      console.error("Error parsing session data:", error);
      return null;
    }
  }
  return null;
};

// Clear session data
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

// Validate session (check if it's expired)
export const isValidSession = () => {
  const session = getSession();
  if (!session) return false;

  // Check if session is older than 24 hours (86400000 ms)
  const now = Date.now();
  const sessionAge = now - session.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (sessionAge > maxAge) {
    clearSession();
    return false;
  }

  return true;
};

// Export authentication methods
export const signIn = async (email: string, password: string) => {
  try {
    // Call the backend auth endpoint directly
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const result = await response.json();

    if (response.ok && result.token) {
      // Store the session data
      storeSession(result.user, result.token);
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.error || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
};

export const signUp = async (
  email: string,
  password: string,
  name?: string,
) => {
  try {
    // Call the backend auth endpoint directly
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      },
    );

    const result = await response.json();

    if (response.ok && result.token) {
      // Store the session data
      storeSession(result.user, result.token);
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.error || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An error occurred during registration" };
  }
};

export const signOut = async () => {
  try {
    // Clear the session data
    clearSession();
    return { success: true };
  } catch (error) {
    return { success: false, error: "An error occurred during logout" };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return isValidSession();
};

// Refresh session if needed
export const refreshSession = () => {
  const session = getSession();
  if (session) {
    // Update the timestamp to extend the session
    const updatedSession = {
      ...session,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

    // Update token in localStorage for API client
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", session.token);
    }
  }
};
