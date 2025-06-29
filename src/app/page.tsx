'use client';

import { useState } from 'react';
import { Coins, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleHandCashLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to HandCash OAuth
      const authUrl = `/api/auth/handcash/login`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error logging in with HandCash:', error);
      setIsLoading(false);
    }
  };

  const stats = [
    { name: 'Total Tokens', value: '1,234', icon: Coins, change: '+4.75%' },
    { name: 'Active Traders', value: '2,567', icon: Users, change: '+12.3%' },
    { name: 'Total Volume', value: '$45,892', icon: DollarSign, change: '+23.1%' },
    { name: 'Market Cap', value: '$1.2M', icon: TrendingUp, change: '+18.7%' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to CashHandle Token Store
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create and trade tokens based on HandCash handles. Each token represents a share in future 
            payments to that HandCash handle, with automatic dividend distribution.
          </p>
        </div>

        {/* HandCash Connection Section */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Connect Your HandCash Account
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Sign in with your HandCash handle to create your token and start trading
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleHandCashLogin}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Connect HandCash Wallet'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Tokens</p>
                <p className="text-2xl font-bold text-white">{stats[0].value}</p>
                <p className="text-sm text-green-400">{stats[0].change}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Traders</p>
                <p className="text-2xl font-bold text-white">{stats[1].value}</p>
                <p className="text-sm text-green-400">{stats[1].change}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-white">{stats[2].value}</p>
                <p className="text-sm text-green-400">{stats[2].change}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Market Cap</p>
                <p className="text-2xl font-bold text-white">{stats[3].value}</p>
                <p className="text-sm text-green-400">{stats[3].change}</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect HandCash</h3>
              <p className="text-gray-300">
                Sign in with your HandCash handle to automatically create your token. Your handle becomes 
                a tradeable asset (e.g., @JohnBaker becomes $JohnBaker).
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Trade Tokens</h3>
              <p className="text-gray-300">
                Buy and sell tokens representing HandCash handles of any amount. Each token is backed by 1 billion shares 
                that can be traded freely on the marketplace.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Earn Dividends</h3>
              <p className="text-gray-300">
                When payments are made to a HandCash handle, they&apos;re automatically distributed as dividends 
                to token holders proportional to their share ownership. Only holders with more than 200,000 tokens 
                receive dividends due to network fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
