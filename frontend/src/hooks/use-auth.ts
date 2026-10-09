import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { api } from '@/lib/api';

const DEFAULT_ADMIN_USER: User = {
  id: '1',
  name: 'Gleydson',
  email: 'admin@gleydsontattoo.com',
  role: UserRole.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored);
      // Auto-fallback if token exists
      const token = localStorage.getItem('accessToken');
      if (token) return DEFAULT_ADMIN_USER;
    } catch {
      // ignore JSON parse error
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem('accessToken');
  });

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Try getting from local cache first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(DEFAULT_ADMIN_USER);
          localStorage.setItem('user', JSON.stringify(DEFAULT_ADMIN_USER));
        }

        // Validate or refresh with /api/auth/me
        try {
          const response = await api.get<{ data: User }>('/api/auth/me');
          if (response?.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch {
          // If server fails or offline, keep cached admin user if token is present
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();

    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(DEFAULT_ADMIN_USER);
        }
      } else if (!token) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((token: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    setUser(null);
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === UserRole.ADMIN,
  };
}

