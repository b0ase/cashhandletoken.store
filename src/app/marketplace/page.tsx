'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, TrendingUp, AlertCircle } from 'lucide-react';

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

const MINIMUM_TRANCHE = 200000; // 1 billion ÷ 5000

export default function Marketplace() {
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [createOrderData, setCreateOrderData] = useState({
    tokenSymbol: '',
    amount: '',
    pricePerToken: '',
  });

  useEffect(() => {
    fetchData();
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
    if (amount < MINIMUM_TRANCHE) {
      alert(`Minimum sell amount is ${MINIMUM_TRANCHE.toLocaleString()} tokens`);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Marketplace</h1>
              <p className="text-lg text-gray-300">
                Buy and sell HandCash handle tokens with minimum tranches of{' '}
                {MINIMUM_TRANCHE.toLocaleString()} tokens
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateOrder(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Sell Order
              </button>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-200">
                Important: Dividend Eligibility
              </h3>
              <p className="text-sm text-yellow-300 mt-1">
                Only holders with more than {MINIMUM_TRANCHE.toLocaleString()} tokens 
                receive dividend payments. Smaller holdings will not receive payouts due to network fees.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sell Orders */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Active Sell Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Price per Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sellOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {order.token.symbol}
                          </div>
                          <div className="text-sm text-gray-400">
                            {order.token.handcashHandle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {parseInt(order.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatCurrency(order.pricePerToken)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatCurrency(order.totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {order.seller.displayName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user && user.handcashHandle !== order.seller.handcashHandle ? (
                            <button
                              onClick={() => handleBuyOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Buy
                            </button>
                          ) : (
                            <span className="text-gray-500">Your order</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sellOrders.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-white">No sell orders</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Be the first to create a sell order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Market Stats */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Total Active Orders</p>
                  <p className="text-2xl font-semibold text-white">
                    {sellOrders.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Volume (24h)</p>
                  <p className="text-2xl font-semibold text-white">
                    $12,456
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average Price</p>
                  <p className="text-2xl font-semibold text-white">
                    $0.000875
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Trading Rules</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Minimum trade: {MINIMUM_TRANCHE.toLocaleString()} tokens</p>
                <p>• Only holdings &gt; {MINIMUM_TRANCHE.toLocaleString()} earn dividends</p>
                <p>• Trades settled on BSV blockchain</p>
                <p>• Network fees apply to all transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Sell Order Modal */}
        {showCreateOrder && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800 border-gray-700">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-white mb-4">
                  Create Sell Order
                </h3>
                <form onSubmit={handleCreateSellOrder}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white focus:border-blue-500"
                      placeholder="e.g., $JohnTheBaker"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Amount (min {MINIMUM_TRANCHE.toLocaleString()})
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white focus:border-blue-500"
                      min={MINIMUM_TRANCHE}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white focus:border-blue-500"
                      placeholder="0.000001"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateOrder(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 