import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string | null;
  name?: string;
  image?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is a mock implementation
    // In a real app, you would fetch the user from your auth provider
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data - replace with actual auth logic
        const mockUser: User = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User'
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
};
