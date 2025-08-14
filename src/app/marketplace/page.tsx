'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, TrendingUp, AlertCircle, Search, Filter, Grid3X3, List, Eye, Clock, User, BarChart3 } from 'lucide-react';
import { getThemedImage, getUnsplashImages, type UnsplashImage } from '@/lib/unsplash';

interface SellOrder {
  id: string;
  amount: string;
  pricePerToken: number;
  totalValue: number;
  seller: {
    handcashHandle: string;
    displayName: string;
  };
  token: {
    symbol: string;
    handcashHandle: string;
  };
  createdAt: string;
}

interface UserProfile {
  id: string;
  handcashHandle: string;
  displayName: string;
}

const MINIMUM_TRANCHE = 200000; // Threshold for dividend eligibility

export default function Marketplace() {
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'volume' | 'newest'>('newest');
  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(null);
  const [tokenImages, setTokenImages] = useState<UnsplashImage[]>([]);
  const [createOrderData, setCreateOrderData] = useState({
    tokenSymbol: '',
    amount: '',
    pricePerToken: '',
  });

  useEffect(() => {
    fetchData();
    
    // Load images
    getThemedImage('trading', 1920, 400).then(setHeroImage);
    getUnsplashImages('cryptocurrency finance trading', 12, 300, 200).then(setTokenImages);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userResponse = await fetch('/api/auth/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Fetch sell orders
      const ordersResponse = await fetch('/api/marketplace/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setSellOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSellOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to create sell orders');
      return;
    }

    const amount = parseInt(createOrderData.amount);
    if (amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenSymbol: createOrderData.tokenSymbol,
          amount: amount,
          pricePerToken: parseFloat(createOrderData.pricePerToken),
        }),
      });

      if (response.ok) {
        setShowCreateOrder(false);
        setCreateOrderData({ tokenSymbol: '', amount: '', pricePerToken: '' });
        fetchData(); // Refresh the orders
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create sell order');
      }
    } catch (error) {
      console.error('Error creating sell order:', error);
      alert('Failed to create sell order');
    }
  };

  const handleBuyOrder = async (orderId: string) => {
    if (!user) {
      alert('Please log in to buy tokens');
      return;
    }

    if (!confirm('Are you sure you want to buy these tokens?')) {
      return;
    }

    try {
      const response = await fetch(`/api/marketplace/orders/${orderId}/buy`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Purchase successful!');
        fetchData(); // Refresh the orders
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error buying tokens:', error);
      alert('Failed to complete purchase');
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(4)}`;
  };

  // Filter and sort orders
  const filteredAndSortedOrders = sellOrders
    .filter(order => 
      order.token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.token.handcashHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerToken - b.pricePerToken;
        case 'volume':
          return b.totalValue - a.totalValue;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getRandomTokenImage = (index: number) => {
    if (tokenImages.length === 0) return null;
    return tokenImages[index % tokenImages.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-700 h-96 rounded-lg"></div>
              <div className="bg-gray-700 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                Token Marketplace
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover, trade, and invest in HandCash handle tokens with real dividend potential
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-600 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-blue-400 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-200 mb-2">
                Dividend Eligibility Notice
              </h3>
              <p className="text-blue-300">
                Only holders with more than {MINIMUM_TRANCHE.toLocaleString()} tokens 
                receive dividend payments when payments flow through HandCash handles. 
                All token amounts can be traded freely regardless of dividend eligibility.
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens, handles, or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'volume' | 'newest')}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="volume">Highest Value</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Create Order Button */}
              {user && (
                <button
                  onClick={() => setShowCreateOrder(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedOrders.map((order, index) => {
                  const tokenImage = getRandomTokenImage(index);
                  return (
                    <div key={order.id} className="group">
                      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700">
                        {/* Token Image */}
                        <div className="h-48 overflow-hidden relative">
                          {tokenImage ? (
                            <img
                              src={tokenImage.url}
                              alt={tokenImage.alt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {order.token.symbol}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                              LIVE
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">{order.token.symbol}</h3>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Price per token</p>
                              <p className="text-lg font-bold text-green-400">{formatCurrency(order.pricePerToken)}</p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Handle:</span>
                              <span className="text-white font-medium">{order.token.handcashHandle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount:</span>
                              <span className="text-white font-medium">{parseInt(order.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Value:</span>
                              <span className="text-white font-bold">{formatCurrency(order.totalValue)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-400">{order.seller.displayName}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {user && user.handcashHandle !== order.seller.handcashHandle ? (
                            <button
                              onClick={() => handleBuyOrder(order.id)}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all duration-200"
                            >
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Buy Tokens
                            </button>
                          ) : (
                            <div className="w-full bg-gray-700 text-gray-400 font-medium py-3 rounded-lg text-center">
                              Your Order
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price per Token
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Seller
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {filteredAndSortedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">
                                  {order.token.symbol.charAt(1)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{order.token.symbol}</div>
                                <div className="text-sm text-gray-400">{order.token.handcashHandle}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                            {parseInt(order.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                            {formatCurrency(order.pricePerToken)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                            {formatCurrency(order.totalValue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {order.seller.displayName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user && user.handcashHandle !== order.seller.handcashHandle ? (
                              <button
                                onClick={() => handleBuyOrder(order.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Buy
                              </button>
                            ) : (
                              <span className="text-gray-500 font-medium">Your order</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredAndSortedOrders.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <TrendingUp className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    {searchTerm ? 'No matching orders' : 'No sell orders available'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters.' 
                      : 'Be the first to create a sell order and start trading.'}
                  </p>
                  {user && !searchTerm && (
                    <button
                      onClick={() => setShowCreateOrder(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create First Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Market Overview
              </h3>
              <div className="space-y-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-white">{sellOrders.length}</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">24h Volume</p>
                  <p className="text-3xl font-bold text-green-400">$12,456</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Average Price</p>
                  <p className="text-3xl font-bold text-blue-400">$0.000875</p>
                </div>
              </div>
            </div>

            {/* Trading Rules */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Trading Rules
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Minimum trade: {MINIMUM_TRANCHE.toLocaleString()} tokens</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Only holdings &gt; {MINIMUM_TRANCHE.toLocaleString()} earn dividends</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Trades settled on BSV blockchain</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Network fees apply to all transactions</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">$Handle{i} traded</p>
                        <p className="text-gray-400 text-xs">{i} min ago</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm font-medium">+5.2%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Sell Order Modal */}
        {showCreateOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Create Sell Order</h3>
                  <p className="text-gray-400">List your tokens for sale in the marketplace</p>
                </div>
                
                <form onSubmit={handleCreateSellOrder} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      value={createOrderData.tokenSymbol}
                      onChange={(e) =>
                        setCreateOrderData({
                          ...createOrderData,
                          tokenSymbol: e.target.value,
                        })
                      }
                      className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., $JohnTheBaker"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount <span className="text-gray-500">(min {MINIMUM_TRANCHE.toLocaleString()})</span>
                    </label>
                    <input
                      type="number"
                      value={createOrderData.amount}
                      onChange={(e) =>
                        setCreateOrderData({
                          ...createOrderData,
                          amount: e.target.value,
                        })
                      }
                      className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      min={MINIMUM_TRANCHE}
                      placeholder={MINIMUM_TRANCHE.toLocaleString()}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price per Token ($)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={createOrderData.pricePerToken}
                      onChange={(e) =>
                        setCreateOrderData({
                          ...createOrderData,
                          pricePerToken: e.target.value,
                        })
                      }
                      className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="0.000001"
                      required
                    />
                  </div>
                  
                  {createOrderData.amount && createOrderData.pricePerToken && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Value:</span>
                        <span className="text-white font-bold text-lg">
                          {formatCurrency(parseFloat(createOrderData.amount) * parseFloat(createOrderData.pricePerToken))}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateOrder(false)}
                      className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {heroImage && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-40">
            Photo by{' '}
            <a
              href={heroImage.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {heroImage.photographer}
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 