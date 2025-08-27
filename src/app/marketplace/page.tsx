'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, TrendingUp, AlertCircle, Star, ArrowUpRight, Zap } from 'lucide-react';
import Image from 'next/image';

interface SellOrder {
  id: string;
  amount: string;
  pricePerToken: number;
  totalValue: number;
  seller: {
    handcashHandle: string;
    displayName: string;
    avatar?: string;
  };
  token: {
    symbol: string;
    handcashHandle: string;
    imageUrl: string;
    verified?: boolean;
    tokenType?: string;
    inscriptionId?: string;
    mintingAddress?: string;
  };
  createdAt: string;
}

interface UserProfile {
  id: string;
  handcashHandle: string;
  displayName: string;
}

const MINIMUM_TRANCHE = 200000;

// Premium sample tokens with professional images
const PREMIUM_TOKENS: SellOrder[] = [
  {
    id: '1',
    amount: '1000000',
    pricePerToken: 0.001250,
    totalValue: 1250,
    seller: {
      handcashHandle: '@CashHandlePro',
      displayName: 'HandCash Executive',
      avatar: '/images/avatars/executive.webp'
    },
    token: {
      symbol: '$CASHHANDLE',
      handcashHandle: '@CashHandlePro',
      imageUrl: '/images/tokens/cashhandle.webp',
      verified: true,
      tokenType: 'ORDINAL',
      inscriptionId: 'ord_123456789',
      mintingAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
    },
    createdAt: '2024-06-29T14:30:00Z'
  },
  {
    id: '2',
    amount: '750000',
    pricePerToken: 0.001180,
    totalValue: 885,
    seller: {
      handcashHandle: '@ProTrader',
      displayName: 'Professional Trader',
      avatar: '/images/avatars/entrepreneur.webp'
    },
    token: {
      symbol: '$TRADER',
      handcashHandle: '@ProTrader',
      imageUrl: '/images/tokens/trader.webp',
      verified: true,
      tokenType: 'ORDINAL',
      inscriptionId: 'ord_987654321',
      mintingAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
    },
    createdAt: '2024-06-29T13:45:00Z'
  },
  {
    id: '3',
    amount: '500000',
    pricePerToken: 0.001890,
    totalValue: 945,
    seller: {
      handcashHandle: '@InvestorElite',
      displayName: 'Elite Investor',
      avatar: '/images/avatars/executive.webp'
    },
    token: {
      symbol: '$INVESTOR',
      handcashHandle: '@InvestorElite',
      imageUrl: '/images/tokens/investor.webp',
      verified: true,
      tokenType: 'ORDINAL',
      inscriptionId: 'ord_456789123',
      mintingAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
    },
    createdAt: '2024-06-29T12:15:00Z'
  }
];

export default function Marketplace() {
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch user data
      try {
        const userResponse = await fetch('/api/auth/user');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      } catch {
        // User not logged in
      }

      // Use premium sample data
      setSellOrders(PREMIUM_TOKENS);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      setSellOrders(PREMIUM_TOKENS);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyOrder = async (orderId: string) => {
    if (!user) {
      alert('Please connect your HandCash account to buy tokens');
      return;
    }

    if (!confirm('Confirm purchase of these tokens?')) {
      return;
    }

    alert('Purchase successful! (Demo mode)');
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(4)}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <nav className="flex justify-center space-x-8 mb-8">
          <a href="/" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Home</a>
          <a href="/marketplace" className="text-white font-medium border-b-2 border-blue-500 pb-1">Marketplace</a>
          <a href="/rankings" className="text-gray-300 hover:text-white font-medium pb-1 transition-colors">Rankings</a>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Token Marketplace</h1>
              <p className="text-lg text-gray-300">
                Trade HandCash handle tokens with confidence
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateOrder(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Sell Order
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Orders</p>
                  <p className="text-2xl font-bold text-white">{sellOrders.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-white">$3,080</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Average Price</p>
                  <p className="text-2xl font-bold text-white">$0.0014</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified Tokens</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <div className="h-8 w-8 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-900/50 border border-blue-600/50 rounded-lg p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-200 mb-1">
                Dividend Eligibility Notice
              </h3>
              <p className="text-sm text-blue-300">
                Only token holders with more than {MINIMUM_TRANCHE.toLocaleString()} tokens 
                receive dividend payments. All token amounts can be traded freely.
              </p>
            </div>
          </div>
        </div>

        {/* Token Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sellOrders.map((order) => (
            <div key={order.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Token Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src={order.token.imageUrl}
                        alt={order.token.symbol}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                      {order.token.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="h-3 w-3 bg-white rounded-full"></div>
                        </div>
                      )}
                      {order.token.tokenType === 'ORDINAL' && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                          <Zap className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">{order.token.symbol}</h3>
                      <p className="text-sm text-gray-400">{order.token.handcashHandle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-sm text-white">{formatTime(order.createdAt)}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white font-medium">{parseInt(order.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price per Token</span>
                    <span className="text-white font-medium">{formatCurrency(order.pricePerToken)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                    <span className="text-gray-400">Total Value</span>
                    <span className="text-xl font-bold text-green-400">{formatCurrency(order.totalValue)}</span>
                  </div>

                  {/* Ordinals Information */}
                  {order.token.tokenType === 'ORDINAL' && (
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 text-sm font-medium flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          BSV Ordinals Token
                        </span>
                      </div>
                      {order.token.inscriptionId && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Inscription ID</p>
                          <p className="text-xs text-gray-400 font-mono break-all">
                            {order.token.inscriptionId}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {order.seller.avatar && (
                      <Image
                        src={order.seller.avatar}
                        alt={order.seller.displayName}
                        width={32}
                        height={32}
                        className="rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{order.seller.displayName}</p>
                      <p className="text-xs text-gray-400">{order.seller.handcashHandle}</p>
                    </div>
                  </div>
                  {user && user.handcashHandle !== order.seller.handcashHandle ? (
                    <button
                      onClick={() => handleBuyOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500 px-4 py-2">Your Order</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sellOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <TrendingUp className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Active Orders</h3>
              <p className="text-gray-400 mb-6">
                Be the first to create a sell order in the marketplace.
              </p>
              {user && (
                <button
                  onClick={() => setShowCreateOrder(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Create First Order
                </button>
              )}
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {showCreateOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Create Sell Order</h3>
              <p className="text-gray-400 mb-6">
                List your tokens for sale on the marketplace
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token Symbol
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., $YOURHANDLE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (min {MINIMUM_TRANCHE.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="500000"
                    min={MINIMUM_TRANCHE}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Token ($)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0.001000"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateOrder(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Order created! (Demo mode)');
                    setShowCreateOrder(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 