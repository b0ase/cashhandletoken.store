'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleConnect = () => {
    window.location.href = '/auth/signin';
  };

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              CashHandle Token Store
            </h1>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/rankings"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Rankings
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/divvy"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Divvy
            </Link>
            
            {/* Auth Section */}
            <div className="ml-4 pl-4 border-l border-gray-600">
              {isLoading ? (
                <span className="text-gray-400 text-sm">Loading...</span>
              ) : isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/dashboard"
                    className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10.5V7h1.5v3H11v1.5H9.5v2H8v-2H6V10h2v.5z"/>
                  </svg>
                  <span>Connect with HandCash</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}