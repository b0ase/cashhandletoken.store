'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function DivvyDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dividendStats, setDividendStats] = useState({
    totalDividendsPaid: 0,
    activeTokens: 0,
    pendingDistributions: 0,
    totalHolders: 0
  });

  useEffect(() => {
    // Check if user is authenticated and load their Divvy data
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          await loadDividendStats();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadDividendStats = async () => {
    try {
      const response = await fetch('/api/divvy/stats');
      if (response.ok) {
        const stats = await response.json();
        setDividendStats(stats);
      }
    } catch (error) {
      console.error('Error loading dividend stats:', error);
    }
  };

  const handleHandCashLogin = async () => {
    setIsLoading(true);
    try {
      const authUrl = `/api/auth/handcash/login`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error logging in with HandCash:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Divvy...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Divvy Sub-Navigation */}
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <div className="flex justify-center space-x-8">
              <a href="/divvy" className="text-white font-medium border-b-2 border-red-500 pb-1">Overview</a>
              <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
              <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Divvy - Automated Dividend Distribution
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect your HandCash account to automatically distribute dividends to token holders
              when payments are received to your HandCash handle.
            </p>

            <div className="bg-gray-800 rounded-lg p-8 mb-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Connect Your HandCash Account
              </h2>
              <p className="text-gray-300 text-center mb-6">
                Sign in to manage your dividend distributions and track token holder payments.
              </p>
              <button
                onClick={handleHandCashLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              >
                Connect HandCash Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Divvy Sub-Navigation */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex justify-center space-x-8">
            <a href="/divvy" className="text-white font-medium border-b-2 border-red-500 pb-1">Overview</a>
            <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
            <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Divvy, {user.handcashHandle}
          </h1>
          <p className="text-xl text-gray-300">
            Manage your automated dividend distributions and track payments to token holders.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Dividends Paid</p>
                <p className="text-2xl font-bold text-white">${dividendStats.totalDividendsPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Tokens</p>
                <p className="text-2xl font-bold text-white">{dividendStats.activeTokens}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Distributions</p>
                <p className="text-2xl font-bold text-white">{dividendStats.pendingDistributions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Holders</p>
                <p className="text-2xl font-bold text-white">{dividendStats.totalHolders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Recent Dividend Payments</h3>
            <div className="space-y-3">
              {/* Placeholder for recent payments */}
              <div className="text-gray-400 text-sm">No recent payments</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Token Management</h3>
            <div className="space-y-3">
              <a href="/divvy/admin" className="block">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Manage Business Dividends
                </button>
              </a>
              <a href="/divvy/dashboard" className="block">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors">
                  View My Earnings
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* How Divvy Works */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Divvy Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Receive Payment</h3>
              <p className="text-gray-300">
                Payments sent to your HandCash handle are automatically detected and recorded
                in the Divvy system for dividend distribution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Calculate Dividends</h3>
              <p className="text-gray-300">
                Divvy automatically calculates dividend amounts based on token holdings
                and prepares batch distributions for all eligible holders.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Distribute Payments</h3>
              <p className="text-gray-300">
                Dividends are automatically sent to token holders via batch transactions,
                ensuring fair distribution proportional to ownership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
