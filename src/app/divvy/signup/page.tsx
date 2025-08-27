'use client';

import { useState, useEffect } from 'react';
import { Coins, DollarSign, Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function DivvySignup() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [creatingToken, setCreatingToken] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await checkExistingToken(userData.handcashHandle);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingToken = async (handle: string) => {
    try {
      const response = await fetch(`/api/tokens/user/${handle}`);
      if (response.ok) {
        const token = await response.json();
        setTokenExists(!!token);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  const handleCreateToken = async () => {
    if (!user || tokenExists) return;

    setCreatingToken(true);
    try {
      const response = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handcashHandle: user.handcashHandle,
        }),
      });

      if (response.ok) {
        const token = await response.json();
        alert(`Successfully created token ${token.symbol}!`);
        window.location.href = '/divvy/admin';
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

  const handleHandCashLogin = () => {
    window.location.href = '/api/auth/handcash/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              <a href="/divvy/signup" className="text-white font-medium border-b-2 border-red-500 pb-1">Sign Up</a>
              <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
              <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Sign Up for Divvy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect your HandCash account to create a token and start receiving automatic dividend distributions.
            </p>

            <button
              onClick={handleHandCashLogin}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Connect HandCash to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (tokenExists) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Divvy Sub-Navigation */}
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <div className="flex justify-center space-x-8">
              <a href="/divvy" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Overview</a>
              <a href="/divvy/signup" className="text-white font-medium border-b-2 border-red-500 pb-1">Sign Up</a>
              <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
              <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Token Already Exists!
            </h2>
            <p className="text-gray-300 text-center mb-6">
              A token for {user.handcashHandle} has already been created. You can manage your dividend distributions from the admin panel.
            </p>
            <div className="flex justify-center">
              <a href="/divvy/admin">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200">
                  Go to Admin Panel
                </button>
              </a>
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
            <a href="/divvy" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Overview</a>
            <a href="/divvy/signup" className="text-white font-medium border-b-2 border-red-500 pb-1">Sign Up</a>
            <a href="/divvy/admin" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Business Admin</a>
            <a href="/divvy/dashboard" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">My Earnings</a>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Divvy Token
          </h1>
          <p className="text-xl text-gray-300">
            Issue a token for {user.handcashHandle} and start distributing dividends automatically
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Information</h3>
              <ul className="text-yellow-300 space-y-2">
                <li>• Creating a token will mint 1 billion tokens for {user.handcashHandle}</li>
                <li>• This action cannot be undone - tokens are permanently on the blockchain</li>
                <li>• You will be able to sell portions of your tokens to investors</li>
                <li>• All payments to {user.handcashHandle} will be automatically distributed to token holders</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Token Creation Card */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Token Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Token Symbol</p>
              <p className="text-white text-xl font-bold">${user.handcashHandle.replace('@', '').toUpperCase()}</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Total Supply</p>
              <p className="text-white text-xl font-bold">1,000,000,000</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Minimum Trading Unit</p>
              <p className="text-white text-xl font-bold">200,000 tokens</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Blockchain</p>
              <p className="text-white text-xl font-bold">BSV (Ordinals)</p>
            </div>
          </div>

          <button
            onClick={handleCreateToken}
            disabled={creatingToken}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {creatingToken ? (
              'Creating Token...'
            ) : (
              <>
                <Coins className="h-5 w-5 mr-2" />
                Create Token & Enable Divvy
              </>
            )}
          </button>
        </div>

        {/* How It Works After Creation */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg mt-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Token Created</h3>
                <p className="text-gray-300">Your token is minted on the BSV blockchain with 1 billion supply</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">List on Marketplace</h3>
                <p className="text-gray-300">You can sell portions of your tokens to investors</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Receive Payments</h3>
                <p className="text-gray-300">Continue receiving payments to your HandCash handle as normal</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Sign Distributions</h3>
                <p className="text-gray-300">Divvy prepares distributions, you review and sign them from your HandCash wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}