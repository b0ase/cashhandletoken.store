'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Send, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DivvyAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTokens, setUserTokens] = useState([]);
  const [pendingDistributions, setPendingDistributions] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await loadUserTokens(userData.id);
        await loadPendingDistributions();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTokens = async (userId: string) => {
    try {
      const response = await fetch('/api/tokens/user');
      if (response.ok) {
        const tokens = await response.json();
        setUserTokens(tokens);
        if (tokens.length > 0) {
          setSelectedToken(tokens[0]);
        }
      }
    } catch (error) {
      console.error('Error loading user tokens:', error);
    }
  };

  const loadPendingDistributions = async () => {
    try {
      const response = await fetch('/api/divvy/distribute');
      if (response.ok) {
        const data = await response.json();
        setPendingDistributions(data.pendingDistributions || []);
      }
    } catch (error) {
      console.error('Error loading pending distributions:', error);
    }
  };

  const handleProcessDistributions = async () => {
    if (!selectedToken) return;

    setLoading(true);
    try {
      // Process distributions for the selected token's pending payments
      const response = await fetch('/api/divvy/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: selectedToken.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Processed ${result.successful} distributions successfully!`);
        await loadPendingDistributions();
      } else {
        alert('Failed to process distributions');
      }
    } catch (error) {
      console.error('Error processing distributions:', error);
      alert('Error processing distributions');
    } finally {
      setLoading(false);
    }
  };

  const handleHandCashLogin = () => {
    window.location.href = '/api/auth/handcash/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Divvy Admin...</div>
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
              <a href="/divvy/admin" className="text-white font-medium border-b-2 border-red-500 pb-1">Business Admin</a>
              <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Divvy Admin - Business Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Sign in to manage your token distributions and track dividend payments to holders.
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
            <a href="/divvy/admin" className="text-white font-medium border-b-2 border-red-500 pb-1">Business Admin</a>
            <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Divvy Admin - {user.handcashHandle}
          </h1>
          <p className="text-xl text-gray-300">
            Manage your dividend distributions and track payments to token holders.
          </p>
        </div>

        {/* Token Selection */}
        {userTokens.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Select Token to Manage</h3>
            <div className="flex flex-wrap gap-4">
              {userTokens.map(token => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedToken?.id === token.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {token.symbol} ({token.handcashHandle})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {selectedToken && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-600 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Supply</p>
                  <p className="text-2xl font-bold text-white">
                    {Number(selectedToken.totalSupply).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Token Holders</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedToken.holdings?.length || 0}
                  </p>
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
                  <p className="text-2xl font-bold text-white">
                    {pendingDistributions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Process Distributions</h3>
            <p className="text-gray-300 mb-4">
              Send pending dividend payments to eligible token holders. Only holders with more than 200,000 tokens will receive payments.
            </p>
            <button
              onClick={handleProcessDistributions}
              disabled={loading || pendingDistributions.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Process ${pendingDistributions.length} Distributions`}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {pendingDistributions.slice(0, 5).map(distribution => (
                <div key={distribution.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Distribution #{distribution.id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(distribution.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-sm text-yellow-400">Pending</span>
                  </div>
                </div>
              ))}
              {pendingDistributions.length === 0 && (
                <p className="text-gray-400 text-sm">No pending distributions</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use Divvy Admin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Receive Payments</h3>
              <p className="text-gray-300 mb-4">
                When someone sends money to your HandCash handle ({user.handcashHandle}),
                our system automatically detects it and creates dividend distributions.
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">2. Review Distributions</h3>
              <p className="text-gray-300 mb-4">
                Check the pending distributions above. Each distribution shows how much
                will be paid to eligible token holders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Process Payments</h3>
              <p className="text-gray-300 mb-4">
                Click "Process Distributions" to send the dividend payments to all eligible holders
                via HandCash. This may take a few minutes for large distributions.
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">4. Track Performance</h3>
              <p className="text-gray-300">
                Monitor your token's performance in the rankings and see how dividend
                distributions affect your token's value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
