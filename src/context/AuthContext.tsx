import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { 
  saveUser, 
  getUser, 
  saveToken, 
  clearAuth, 
  generateJWT, 
  registerUser, 
  authenticateUser, 
  savePassword,
  userExistsByEmail,
  usernameExists
} from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      if (!userExistsByEmail(email)) {
        return { 
          success: false, 
          error: 'No account found with this email. Please register first.' 
        };
      }

      // Authenticate user
      const authenticatedUser = authenticateUser(email, password);
      
      if (!authenticatedUser) {
        return { 
          success: false, 
          error: 'Invalid password. Please try again.' 
        };
      }

      const token = generateJWT(authenticatedUser);
      
      saveUser(authenticatedUser);
      saveToken(token);
      setUser(authenticatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    username: string, 
    email: string, 
    password: string, 
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Validate input
      if (!username || !email || !password || !name) {
        return { 
          success: false, 
          error: 'All fields are required.' 
        };
      }

      if (password.length < 6) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters long.' 
        };
      }

      // Check if email is already registered
      if (userExistsByEmail(email)) {
        return { 
          success: false, 
          error: 'An account with this email already exists. Please login instead.' 
        };
      }

      // Check if username is taken
      if (usernameExists(username)) {
        return { 
          success: false, 
          error: 'This username is already taken. Please choose another one.' 
        };
      }

      // Register new user
      const newUser = registerUser({
        username,
        email,
        name,
        theme: 'light'
      });

      // Save password separately (in real app, this would be hashed)
      savePassword(newUser.id, password);

      const token = generateJWT(newUser);
      
      saveUser(newUser);
      saveToken(token);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during registration.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    clearAuth();
    setUser(null);
  };

  // Updated interface to match new return types
  const value = {
    user,
    login: async (email: string, password: string) => {
      const result = await login(email, password);
      return result.success;
    },
    signup: async (username: string, email: string, password: string, name: string) => {
      const result = await signup(username, email, password, name);
      return result.success;
    },
    loginWithError: login,
    signupWithError: signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};