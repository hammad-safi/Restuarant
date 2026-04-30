// Authentication hooks
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, logoutAdmin, verifyAuth } from '@/lib/api';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          const response = await verifyAuth();
          if (response.success && (response.data as any)?.user) {
            setUser((response.data as any).user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginAdmin(username, password);

      if (response.success && response.data) {
        const { token, user } = response.data as any;
        localStorage.setItem('auth_token', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }

      return {
        success: false,
        message: response.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutAdmin();
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}