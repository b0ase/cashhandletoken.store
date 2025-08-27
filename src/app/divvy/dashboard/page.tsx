'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, Calendar, Download } from 'lucide-react';

interface DividendEarning {
  tokenId: string;
  tokenSymbol: string;
  holdingAmount: number;
  ownershipPercentage: number;
  totalDividendsPaid: number;
  estimatedEarnings: number;
  dividendPayments: number;
}

export default function DividendDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<DividendEarning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    checkAuthAndLoadEarnings();
  }, []);

  const checkAuthAndLoadEarnings = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await loadDividendEarnings();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDividendEarnings = async () => {
    try {
      const response = await fetch('/api/divvy/earnings');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.earnings || []);
        setTotalEarnings(data.totalEarnings || 0);
        setTotalTokens(data.totalTokens || 0);
      }
    } catch (error) {
      console.error('Error loading dividend earnings:', error);
    }
  };

  const handleHandCashLogin = () => {
    window.location.href = '/api/auth/handcash/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dividend Dashboard...</div>
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
              <a href="/divvy" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Overview</a>
              <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
              <a href="/divvy/dashboard" className="text-white font-medium border-b-2 border-red-500 pb-1">My Earnings</a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Dividend Earnings Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Track your dividend earnings from all your token holdings in one place.
            </p>

            <button
              onClick={handleHandCashLogin}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Connect HandCash Wallet
            </button>
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
            <a href="/divvy" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Overview</a>
            <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
            <a href="/divvy/dashboard" className="text-white font-medium border-b-2 border-red-500 pb-1">My Earnings</a>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dividend Earnings - {user.handcashHandle}
          </h1>
          <p className="text-xl text-gray-300">
            Track your dividend payments from all your token holdings.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Tokens Held</p>
                <p className="text-2xl font-bold text-white">{totalTokens}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Avg. Ownership</p>
                <p className="text-2xl font-bold text-white">
                  {totalTokens > 0
                    ? (earnings.reduce((sum, token) => sum + token.ownershipPercentage, 0) / totalTokens).toFixed(2)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Payments</p>
                <p className="text-2xl font-bold text-white">
                  {earnings.reduce((sum, token) => sum + token.dividendPayments, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Your Token Holdings & Earnings</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Holdings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ownership
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Dividends Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Your Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Payments
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {earnings.map((earning) => (
                  <tr key={earning.tokenId} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{earning.tokenSymbol}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {earning.holdingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {earning.ownershipPercentage.toFixed(4)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${earning.totalDividendsPaid.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-green-400 font-medium">
                        ${earning.estimatedEarnings.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {earning.dividendPayments}
                    </td>
                  </tr>
                ))}
                {earnings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No token holdings found. Start investing in tokens to earn dividends!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Earnings Report
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            View Payment History
          </button>
        </div>

        {/* Educational Content */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">How Dividend Earnings Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Token Holdings</h3>
              <p className="text-gray-300 mb-4">
                Your dividend earnings are calculated based on your percentage ownership of each token.
                The more tokens you hold, the larger your share of dividend payments.
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">Minimum Threshold</h3>
              <p className="text-gray-300">
                Only token holders with more than 200,000 tokens receive dividend payments.
                This ensures network fees don't exceed the payment amounts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Payment Timing</h3>
              <p className="text-gray-300 mb-4">
                Dividends are paid automatically when businesses send money to their HandCash handles.
                Payments are processed in batches and may take a few minutes to complete.
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">Track Your Returns</h3>
              <p className="text-gray-300">
                Use this dashboard to monitor your passive income from token investments.
                Higher ownership percentages in active tokens generate more dividends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
