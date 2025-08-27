'use client';

import { useState, useEffect } from 'react';
import { Coins, DollarSign, TrendingUp, ArrowRight, CheckCircle, AlertCircle, Settings, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserToken {
  id: string;
  symbol: string;
  totalSupply: bigint;
  availableSupply: bigint;
  holders: number;
  listed: boolean;
  divvyEnabled: boolean;
  totalDividendsPaid: number;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [showTokenCreation, setShowTokenCreation] = useState(false);
  const [creatingToken, setCreatingToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserToken(user.name);
    }
  }, [user]);

  const checkUserToken = async (handle: string) => {
    try {
      const response = await fetch(`/api/tokens/user/${handle}`);
      if (response.ok) {
        const token = await response.json();
        setUserToken(token);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async () => {
    if (!user) return;
    
    setCreatingToken(true);
    try {
      const response = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handcashHandle: user.name,
        }),
      });

      if (response.ok) {
        const token = await response.json();
        setUserToken(token);
        setShowTokenCreation(false);
        alert(`Successfully created token ${token.symbol}!`);
      } else {
        alert('Failed to create token');
      }
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Error creating token');
    } finally {
      setCreatingToken(false);
    }
  };

  const handleEnableDivvy = async () => {
    // Navigate to Divvy setup
    window.location.href = '/divvy/signup';
  };

  const handleListOnMarket = async () => {
    // Navigate to marketplace listing
    window.location.href = '/marketplace/list';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-300">
            Manage your token, track dividends, and monitor your earnings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => window.location.href = '/marketplace'}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-blue-400 mb-2" />
            <div className="text-white font-medium">Browse Market</div>
            <div className="text-gray-400 text-sm">Trade tokens</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/divvy/dashboard'}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors"
          >
            <DollarSign className="h-6 w-6 text-green-400 mb-2" />
            <div className="text-white font-medium">My Earnings</div>
            <div className="text-gray-400 text-sm">Track dividends</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/rankings'}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors"
          >
            <Activity className="h-6 w-6 text-purple-400 mb-2" />
            <div className="text-white font-medium">Rankings</div>
            <div className="text-gray-400 text-sm">Top tokens</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/settings'}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors"
          >
            <Settings className="h-6 w-6 text-gray-400 mb-2" />
            <div className="text-white font-medium">Settings</div>
            <div className="text-gray-400 text-sm">Account settings</div>
          </button>
        </div>

        {/* Token Status */}
        {!userToken ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Coins className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Create Your Token
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Issue a token for your HandCash handle {user.name} and start earning from token sales.
              Enable Divvy to automatically distribute incoming payments to your token holders.
            </p>
            
            {!showTokenCreation ? (
              <button
                onClick={() => setShowTokenCreation(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              >
                Create My Token
              </button>
            ) : (
              <div className="bg-gray-700 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Token Creation Agreement</h3>
                <div className="text-left space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                          <p className="text-sm text-gray-300">
                        1 billion tokens will be created for {user.name}
                      </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-300">
                      You can sell portions of your tokens on the marketplace
                    </p>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                          <p className="text-sm text-gray-300">
                        If you enable Divvy, all payments to {user.name} will be distributed to token holders
                      </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateToken}
                    disabled={creatingToken}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    {creatingToken ? 'Creating...' : 'Confirm & Create'}
                  </button>
                  <button
                    onClick={() => setShowTokenCreation(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Token Overview */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userToken.symbol}
                  </h2>
                  <p className="text-gray-400">{user.name}</p>
                </div>
                <div className="flex space-x-2">
                  {userToken.divvyEnabled ? (
                    <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      Divvy Enabled
                    </span>
                  ) : (
                    <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                      Divvy Disabled
                    </span>
                  )}
                  {userToken.listed && (
                    <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      Listed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Supply</p>
                  <p className="text-white text-xl font-bold">1,000,000,000</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available</p>
                  <p className="text-white text-xl font-bold">
                    {Number(userToken.availableSupply).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Holders</p>
                  <p className="text-white text-xl font-bold">{userToken.holders}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dividends Paid</p>
                  <p className="text-white text-xl font-bold">
                    ${userToken.totalDividendsPaid.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Divvy Setup */}
              {!userToken.divvyEnabled && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Enable Divvy</h3>
                  <p className="text-gray-300 mb-4">
                    Automatically distribute payments to your {user.name} handle to all token holders.
                  </p>
                  <button
                    onClick={handleEnableDivvy}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    Enable Divvy
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              )}

              {/* List on Market */}
              {!userToken.listed && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-3">List on Marketplace</h3>
                  <p className="text-gray-300 mb-4">
                    Make your tokens available for purchase by investors.
                  </p>
                  <button
                    onClick={handleListOnMarket}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    List Tokens
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              )}

              {/* Manage Divvy */}
              {userToken.divvyEnabled && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Manage Distributions</h3>
                  <p className="text-gray-300 mb-4">
                    View and manage your automatic dividend distributions.
                  </p>
                  <button
                    onClick={() => window.location.href = '/divvy/admin'}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    Divvy Admin
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              )}

              {/* View Holders */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-3">Token Holders</h3>
                <p className="text-gray-300 mb-4">
                  View all holders of your token and their percentages.
                </p>
                <button
                  onClick={() => window.location.href = `/tokens/${userToken.id}/holders`}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  View Holders
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Next Steps</h3>
              <div className="space-y-2 text-sm text-blue-300">
                {!userToken.divvyEnabled && (
                  <p>1. Enable Divvy to automatically distribute dividends to token holders</p>
                )}
                {!userToken.listed && (
                  <p>{userToken.divvyEnabled ? '1' : '2'}. List your tokens on the marketplace to allow trading</p>
                )}
                <p>{!userToken.divvyEnabled && !userToken.listed ? '3' : userToken.divvyEnabled || userToken.listed ? '2' : '1'}. Share your token with potential investors</p>
                <p>{!userToken.divvyEnabled && !userToken.listed ? '4' : '3'}. Track earnings and distributions from your dashboard</p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Your Token Holdings</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-center py-8">
              View all tokens you own in the{' '}
              <a href="/divvy/dashboard" className="text-blue-400 hover:text-blue-300">
                Earnings Dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}