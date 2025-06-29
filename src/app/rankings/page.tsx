'use client';

import { useState, useEffect } from 'react';

interface TokenRanking {
  id: string;
  symbol: string;
  handcashHandle: string;
  price: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  change24h: number;
  owner: {
    displayName: string;
    profilePictureUrl?: string;
  };
}

export default function Rankings() {
  const [tokens, setTokens] = useState<TokenRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof TokenRanking>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens/rankings');
      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      }
    } catch (error) {
      console.error('Error fetching token rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof TokenRanking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPrice = (value: number) => {
    if (value < 0.01) {
      return `$${value.toFixed(6)}`;
    }
    return `$${value.toFixed(4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Token Rankings</h1>
            <p className="text-gray-300">
              Discover and track the most popular HandCash handle tokens by market cap, volume, and holder count.
            </p>
          </div>

          {/* Sorting Controls */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-gray-300">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('marketCap')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortField === 'marketCap' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Market Cap {sortField === 'marketCap' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('volume24h')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortField === 'volume24h' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Volume {sortField === 'volume24h' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('holders')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortField === 'holders' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Holders {sortField === 'holders' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          </div>

          {/* Rankings Table */}
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Total Tokens</h3>
              <p className="text-3xl font-bold text-blue-400">{tokens.length}</p>
              <p className="text-sm text-gray-400">Active tokens in the market</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Total Market Cap</h3>
              <p className="text-3xl font-bold text-green-400">
                ${tokens.reduce((sum, token) => sum + token.marketCap, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Combined value of all tokens</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-2">24h Volume</h3>
              <p className="text-3xl font-bold text-purple-400">
                ${tokens.reduce((sum, token) => sum + token.volume24h, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total trading volume</p>
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
          <h1 className="text-3xl font-bold text-white mb-4">Token Rankings</h1>
          <p className="text-gray-300">
            Discover and track the most popular HandCash handle tokens by market cap, volume, and holder count.
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-300">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('marketCap')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortField === 'marketCap' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Market Cap {sortField === 'marketCap' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('volume24h')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortField === 'volume24h' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Volume {sortField === 'volume24h' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('holders')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortField === 'holders' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Holders {sortField === 'holders' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Holders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedTokens.map((token, index) => (
                  <tr key={token.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {token.owner.profilePictureUrl && (
                          <img
                            className="h-8 w-8 rounded-full mr-3"
                            src={token.owner.profilePictureUrl}
                            alt={token.owner.displayName}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">{token.symbol}</div>
                          <div className="text-sm text-gray-400">{token.handcashHandle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatPrice(token.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatCurrency(token.marketCap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatCurrency(token.volume24h)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {token.holders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${
                        token.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Total Tokens</h3>
            <p className="text-3xl font-bold text-blue-400">{tokens.length}</p>
            <p className="text-sm text-gray-400">Active tokens in the market</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Total Market Cap</h3>
            <p className="text-3xl font-bold text-green-400">
              ${tokens.reduce((sum, token) => sum + token.marketCap, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Combined value of all tokens</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">24h Volume</h3>
            <p className="text-3xl font-bold text-purple-400">
              ${tokens.reduce((sum, token) => sum + token.volume24h, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total trading volume</p>
          </div>
        </div>
      </div>
    </div>
  );
} 