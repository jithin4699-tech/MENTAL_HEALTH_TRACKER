import React, { createContext, useState, useEffect } from 'react';

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Define context interface
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

// Store for registered users (in a real app, this would be a database)
const registeredUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString()
  }
];

// Store user passwords (in a real app, these would be hashed in a database)
const userPasswords: Record<string, string> = {
  'john@example.com': 'password123'
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    // When component mounts, check for saved user in localStorage
    setIsLoading(true);
    
    try {
      const storedUser = localStorage.getItem('elitecoders_user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // No user found in storage
        localStorage.removeItem('elitecoders_user');
        setUser(null);
      }
    } catch (error) {
      setError('Error loading user data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function - in a real app, this would make an API call
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the user with matching email
      const matchedUser = registeredUsers.find(u => u.email === email);
      
      // Check if user exists and password matches
      if (matchedUser && userPasswords[email] === password) {
        const loggedInUser = { ...matchedUser };
        setUser(loggedInUser);
        localStorage.setItem('elitecoders_user', JSON.stringify(loggedInUser));
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - in a real app, this would make an API call
  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if email already exists
      if (registeredUsers.some(u => u.email === email)) {
        setError('Email already registered');
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: String(registeredUsers.length + 1),
        name,
        email,
        createdAt: new Date().toISOString()
      };
      
      // Add user to registered users array
      registeredUsers.push(newUser);
      
      // Save password
      userPasswords[email] = password;
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem('elitecoders_user', JSON.stringify(newUser));
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('elitecoders_user');
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 