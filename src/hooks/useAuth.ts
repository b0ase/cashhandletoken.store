'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const login = async (handle: string, authToken: string) => {
    try {
      const result = await signIn('handcash', {
        handle,
        authToken,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin');
      return false;
    }
    return true;
  };

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
  };
}
