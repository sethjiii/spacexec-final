// Utility functions for handling user authentication
// This handles both regular login and Firebase Google authentication

export interface UserData {
  _id: string;
  name: string;
  email: string;
  profile_pic?: string;
  role?: string;
}

/**
 * Get user data from localStorage
 * Handles both formats:
 * 1. Individual keys (Firebase Google auth): _id, name, email, etc.
 * 2. Single user object: localStorage.getItem("user")
 */
export const getUserFromStorage = (): UserData | null => {
  try {
    // First, try to get individual keys (Firebase Google auth format)
    const userId = localStorage.getItem("_id");
    const userName = localStorage.getItem("name");
    const userEmail = localStorage.getItem("email");
    const userProfilePic = localStorage.getItem("profile_pic");
    const userRole = localStorage.getItem("role");

    if (userId && userName && userEmail) {
      return {
        _id: userId,
        name: userName,
        email: userEmail,
        profile_pic: userProfilePic || undefined,
        role: userRole || undefined,
      };
    }

    // If individual keys don't exist, try to get user object
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      if (user._id) {
        return user;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user from storage:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getUserFromStorage();
  return user !== null && user._id !== undefined;
};

/**
 * Get user ID from localStorage
 */
export const getUserId = (): string | null => {
  const user = getUserFromStorage();
  return user?._id || null;
};

/**
 * Clear all user data from localStorage
 */
export const clearUserData = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("_id");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("profile_pic");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
};
