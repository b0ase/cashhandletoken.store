'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { HandCashConnect } from '@handcash/handcash-connect';

export default function SignIn() {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleHandCashSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement HandCash Connect integration
      // For now, show a placeholder message
      setError('HandCash Connect integration coming soon. Please use manual sign-in for now.');
    } catch {
      setError('Failed to connect to HandCash. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('handcash', {
        handle,
        authToken: 'manual-auth-token', // This would need to be a real token
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with HandCash to get started
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* HandCash Connect Button */}
          <div>
            <button
              onClick={handleHandCashSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect with HandCash'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or sign in manually</span>
            </div>
          </div>

          {/* Manual Sign In Form */}
          <form className="mt-6 space-y-6" onSubmit={handleManualSignIn}>
            <div>
              <label htmlFor="handle" className="sr-only">
                Handle
              </label>
              <input
                id="handle"
                name="handle"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="HandCash Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
