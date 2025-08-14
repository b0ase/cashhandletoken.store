'use client';

import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Filter, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { getThemedImage, getUnsplashImages, type UnsplashImage } from '@/lib/unsplash';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(null);
  const [tokenImages, setTokenImages] = useState<UnsplashImage[]>([]);

  useEffect(() => {
    console.log('Rankings page mounted, fetching tokens...');
    fetchTokens();
    
    // Load images
    getThemedImage('growth', 1920, 400).then(setHeroImage);
    getUnsplashImages('success achievement finance', 20, 200, 200).then(setTokenImages);
  }, []);

  const fetchTokens = async () => {
    console.log('Fetching tokens...');
    try {
      setLoading(true);
      const response = await fetch('/api/tokens/rankings');
      console.log('API response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('API data:', data);
        if (data && data.length > 0) {
          console.log('Setting API data:', data.length, 'tokens');
          setTokens(data);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching token rankings:', error);
    }
    
    console.log('Using fallback data - setting 20 mock tokens');
    // Always set comprehensive b0ase ecosystem data as fallback
    setTokens([
      {
        id: '1',
        symbol: '$CashBoard',
        handcashHandle: '$CashBoard',
        price: 0.001245,
        marketCap: 1245000,
        holders: 5420,
        volume24h: 125000,
        change24h: 24.7,
        owner: { displayName: 'CashBoard Inc' }
      },
      {
        id: '2',
        symbol: '$Marina3D',
        handcashHandle: '$Marina3D',
        price: 0.000856,
        marketCap: 856000,
        holders: 3200,
        volume24h: 89000,
        change24h: 18.3,
        owner: { displayName: 'Marina XYZ' }
      },
      {
        id: '3',
        symbol: '$AUDEX',
        handcashHandle: '$AUDEX',
        price: 0.000642,
        marketCap: 642000,
        holders: 2800,
        volume24h: 67000,
        change24h: 15.9,
        owner: { displayName: 'AUDEX Team' }
      },
      {
        id: '4',
        symbol: '$TribesWallet',
        handcashHandle: '$TribesWallet',
        price: 0.000612,
        marketCap: 612000,
        holders: 2600,
        volume24h: 58000,
        change24h: 13.5,
        owner: { displayName: 'Tribes Wallet Dev' }
      },
      {
        id: '5',
        symbol: '$MetaGraph',
        handcashHandle: '$MetaGraph',
        price: 0.000567,
        marketCap: 567000,
        holders: 2400,
        volume24h: 52000,
        change24h: 11.3,
        owner: { displayName: 'MetaGraph Labs' }
      },
      {
        id: '6',
        symbol: '$NinjaPunkGirls',
        handcashHandle: '$NinjaPunkGirls',
        price: 0.000523,
        marketCap: 523000,
        holders: 4100,
        volume24h: 45000,
        change24h: -3.2,
        owner: { displayName: 'NPG Collective' }
      },
      {
        id: '7',
        symbol: '$TribifyAI',
        handcashHandle: '$TribifyAI',
        price: 0.000456,
        marketCap: 456000,
        holders: 2200,
        volume24h: 38000,
        change24h: 6.4,
        owner: { displayName: 'Tribify Team' }
      },
      {
        id: '8',
        symbol: '$FLOOP',
        handcashHandle: '$FLOOP',
        price: 0.000445,
        marketCap: 445000,
        holders: 2050,
        volume24h: 39000,
        change24h: 10.2,
        owner: { displayName: 'FLOOP Network' }
      },
      {
        id: '9',
        symbol: '$b0ase',
        handcashHandle: '$b0ase',
        price: 0.000423,
        marketCap: 423000,
        holders: 1900,
        volume24h: 41000,
        change24h: 9.8,
        owner: { displayName: 'Richard Boase' }
      },
      {
        id: '10',
        symbol: '$AIGirlfriends',
        handcashHandle: '$AIGirlfriends',
        price: 0.000789,
        marketCap: 789000,
        holders: 2900,
        volume24h: 78000,
        change24h: 12.1,
        owner: { displayName: 'AIGF Team' }
      },
      {
        id: '11',
        symbol: '$OverNerd',
        handcashHandle: '$OverNerd',
        price: 0.000356,
        marketCap: 356000,
        holders: 1680,
        volume24h: 31000,
        change24h: 6.8,
        owner: { displayName: 'OverNerd Gaming' }
      },
      {
        id: '12',
        symbol: '$DNSDEX',
        handcashHandle: '$DNSDEX',
        price: 0.000345,
        marketCap: 345000,
        holders: 1750,
        volume24h: 29000,
        change24h: 7.1,
        owner: { displayName: 'DNS DEX Team' }
      },
      {
        id: '13',
        symbol: '$HyperFlix',
        handcashHandle: '$HyperFlix',
        price: 0.000334,
        marketCap: 334000,
        holders: 1850,
        volume24h: 32000,
        change24h: 8.7,
        owner: { displayName: 'HyperFlix Media' }
      },
      {
        id: '14',
        symbol: '$AITribes',
        handcashHandle: '$AITribes',
        price: 0.000298,
        marketCap: 298000,
        holders: 1650,
        volume24h: 25000,
        change24h: -1.8,
        owner: { displayName: 'AI Tribes Community' }
      },
      {
        id: '15',
        symbol: '$CourseKings',
        handcashHandle: '$CourseKings',
        price: 0.000289,
        marketCap: 289000,
        holders: 1400,
        volume24h: 23000,
        change24h: 5.7,
        owner: { displayName: 'Course Kings Academy' }
      },
      {
        id: '16',
        symbol: '$PennyShares',
        handcashHandle: '$PennyShares',
        price: 0.000267,
        marketCap: 267000,
        holders: 1350,
        volume24h: 22000,
        change24h: 4.5,
        owner: { displayName: 'PennyShares Platform' }
      },
      {
        id: '17',
        symbol: '$VexVoid',
        handcashHandle: '$VexVoid',
        price: 0.000234,
        marketCap: 234000,
        holders: 1200,
        volume24h: 19000,
        change24h: -2.4,
        owner: { displayName: 'VexVoid Studios' }
      },
      {
        id: '18',
        symbol: '$CoffeeCommerce',
        handcashHandle: '$CoffeeCommerce',
        price: 0.000198,
        marketCap: 198000,
        holders: 1100,
        volume24h: 16000,
        change24h: 2.1,
        owner: { displayName: 'Coffee Commerce Co' }
      },
      {
        id: '19',
        symbol: '$LilithTattoo',
        handcashHandle: '$LilithTattoo',
        price: 0.000187,
        marketCap: 187000,
        holders: 980,
        volume24h: 18000,
        change24h: 4.2,
        owner: { displayName: 'Lilith Ink Studio' }
      },
      {
        id: '20',
        symbol: '$WebStrategyPro',
        handcashHandle: '$WebStrategyPro',
        price: 0.000178,
        marketCap: 178000,
        holders: 890,
        volume24h: 15000,
        change24h: 3.9,
        owner: { displayName: 'Web Strategy Consulting' }
      }
    ]);
    setLoading(false);
  };

  const handleSort = (field: keyof TokenRanking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort tokens
  const filteredAndSortedTokens = tokens
    .filter(token => 
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.handcashHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.owner.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
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

  const getRandomTokenImage = (index: number) => {
    if (tokenImages.length === 0) return null;
    return tokenImages[index % tokenImages.length];
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <Trophy className="h-5 w-5 text-gray-500" />;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

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
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-blue-900"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                Token Leaderboard
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Discover the top performing HandCash handle tokens by market cap, volume, and community engagement
              </p>
              <Link
                href="/register"
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Register New Handle
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens, handles, or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('marketCap')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortField === 'marketCap' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Market Cap {sortField === 'marketCap' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('volume24h')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortField === 'volume24h' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Volume {sortField === 'volume24h' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('holders')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortField === 'holders' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Holders {sortField === 'holders' && (sortDirection === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {filteredAndSortedTokens.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="md:order-1 transform md:translate-y-8">
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-300 shadow-xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${getRankBadgeColor(2)} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center`}>
                      {getRankIcon(2)}
                      <span className="ml-2">#2</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      {getRandomTokenImage(1) ? (
                        <img
                          src={getRandomTokenImage(1)!.url}
                          alt={filteredAndSortedTokens[1].symbol}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {filteredAndSortedTokens[1].symbol.charAt(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{filteredAndSortedTokens[1].symbol}</h3>
                    <p className="text-gray-400 mb-4">{filteredAndSortedTokens[1].handcashHandle}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white font-bold">{formatCurrency(filteredAndSortedTokens[1].marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Change:</span>
                        <span className={filteredAndSortedTokens[1].change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                          {filteredAndSortedTokens[1].change24h > 0 ? '+' : ''}{filteredAndSortedTokens[1].change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="md:order-2">
                <div className="bg-gray-800 rounded-2xl p-8 border-2 border-yellow-400 shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${getRankBadgeColor(1)} text-white px-6 py-3 rounded-full text-lg font-bold flex items-center shadow-lg`}>
                      {getRankIcon(1)}
                      <span className="ml-2">#1</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-yellow-400">
                      {getRandomTokenImage(0) ? (
                        <img
                          src={getRandomTokenImage(0)!.url}
                          alt={filteredAndSortedTokens[0].symbol}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {filteredAndSortedTokens[0].symbol.charAt(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{filteredAndSortedTokens[0].symbol}</h3>
                    <p className="text-gray-400 mb-6">{filteredAndSortedTokens[0].handcashHandle}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-yellow-400 font-bold text-lg">{formatCurrency(filteredAndSortedTokens[0].marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Change:</span>
                        <span className={filteredAndSortedTokens[0].change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                          {filteredAndSortedTokens[0].change24h > 0 ? '+' : ''}{filteredAndSortedTokens[0].change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 transform md:translate-y-8">
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-amber-600 shadow-xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${getRankBadgeColor(3)} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center`}>
                      {getRankIcon(3)}
                      <span className="ml-2">#3</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      {getRandomTokenImage(2) ? (
                        <img
                          src={getRandomTokenImage(2)!.url}
                          alt={filteredAndSortedTokens[2].symbol}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {filteredAndSortedTokens[2].symbol.charAt(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{filteredAndSortedTokens[2].symbol}</h3>
                    <p className="text-gray-400 mb-4">{filteredAndSortedTokens[2].handcashHandle}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white font-bold">{formatCurrency(filteredAndSortedTokens[2].marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Change:</span>
                        <span className={filteredAndSortedTokens[2].change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                          {filteredAndSortedTokens[2].change24h > 0 ? '+' : ''}{filteredAndSortedTokens[2].change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="h-6 w-6 mr-2" />
              Complete Rankings
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Holders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredAndSortedTokens.map((token, index) => (
                  <tr key={token.id} className="hover:bg-gray-700 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${getRankBadgeColor(index + 1)} rounded-full flex items-center justify-center mr-3`}>
                          {index < 3 ? (
                            getRankIcon(index + 1)
                          ) : (
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          {getRandomTokenImage(index) ? (
                            <img
                              src={getRandomTokenImage(index)!.url}
                              alt={token.symbol}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-bold">
                                {token.symbol.charAt(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {token.symbol}
                          </div>
                          <div className="text-sm text-gray-400">{token.handcashHandle}</div>
                          <div className="text-xs text-gray-500">{token.owner.displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-medium text-blue-400">{formatPrice(token.price)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-white">{formatCurrency(token.marketCap)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-medium text-green-400">{formatCurrency(token.volume24h)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-white font-medium">{token.holders.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {token.change24h > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <span className={`font-bold ${
                          token.change24h > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedTokens.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Trophy className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {searchTerm ? 'No matching tokens' : 'No tokens available'}
                </h3>
                <p className="text-gray-400">
                  {searchTerm 
                    ? 'Try adjusting your search terms.' 
                    : 'Tokens will appear here once they are created and traded.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Market Overview Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-4 bg-blue-600 rounded-2xl mr-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-1">Total Tokens</h3>
                <p className="text-4xl font-bold text-white">{tokens.length}</p>
                <p className="text-sm text-blue-400 mt-1">Active in market</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-4 bg-green-600 rounded-2xl mr-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-1">Total Market Cap</h3>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(tokens.reduce((sum, token) => sum + token.marketCap, 0))}
                </p>
                <p className="text-sm text-green-400 mt-1">Combined value</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-4 bg-purple-600 rounded-2xl mr-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-1">24h Volume</h3>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(tokens.reduce((sum, token) => sum + token.volume24h, 0))}
                </p>
                <p className="text-sm text-purple-400 mt-1">Trading activity</p>
              </div>
            </div>
          </div>
        </div>

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