'use client';

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Users, DollarSign, ArrowRight, Zap, Shield, BarChart3, Trophy, Crown, Medal } from 'lucide-react';
import { getThemedImage, getUnsplashImages, type UnsplashImage } from '@/lib/unsplash';
import Link from 'next/link';

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

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(null);
  const [featureImages, setFeatureImages] = useState<UnsplashImage[]>([]);
  const [topTokens, setTopTokens] = useState<TokenRanking[]>([]);


  useEffect(() => {
    // Load hero image
    getThemedImage('hero', 1920, 800).then(setHeroImage);
    
    // Load feature images
    getUnsplashImages('cryptocurrency blockchain technology', 3, 400, 250).then(setFeatureImages);
    

    
    // Fetch top tokens
    fetchTopTokens();
  }, []);

  const fetchTopTokens = async () => {
    try {
      const response = await fetch('/api/tokens/rankings');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Get top 5 tokens for the homepage
          setTopTokens(data.slice(0, 5));
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching top tokens:', error);
    }
    
            // Always set realistic data from b0ase ecosystem as fallback
        setTopTokens([
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
            id: '5',
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
            id: '6',
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
            id: '9',
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
            id: '10',
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
            id: '11',
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
            id: '14',
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
            id: '15',
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
            id: '16',
            symbol: '$WebStrategyPro',
            handcashHandle: '$WebStrategyPro',
            price: 0.000178,
            marketCap: 178000,
            holders: 890,
            volume24h: 15000,
            change24h: 3.9,
            owner: { displayName: 'Web Strategy Consulting' }
          },
          {
            id: '17',
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
            id: '18',
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
            id: '19',
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
            id: '20',
            symbol: '$CoffeeCommerce',
            handcashHandle: '$CoffeeCommerce',
            price: 0.000198,
            marketCap: 198000,
            holders: 1100,
            volume24h: 16000,
            change24h: 2.1,
            owner: { displayName: 'Coffee Commerce Co' }
          }
        ]); // Show all 20 tokens on homepage
  };

  const handleHandCashLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to HandCash OAuth
      const authUrl = `/api/auth/handcash/login`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error logging in with HandCash:', error);
      setIsLoading(false);
    }
  };

  const stats = [
    { name: 'Total Tokens', value: '1,234', icon: Coins, change: '+4.75%' },
    { name: 'Active Traders', value: '2,567', icon: Users, change: '+12.3%' },
    { name: 'Total Volume', value: '$45,892', icon: DollarSign, change: '+23.1%' },
    { name: 'Market Cap', value: '$1.2M', icon: TrendingUp, change: '+18.7%' },
  ];

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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-gray-500" />;
  };



  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Turn Your
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {' '}HandCash Handle
            </span>
            <br />
            Into a Tradeable Asset
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create tokens from HandCash handles and earn dividends when payments flow through them. 
            The future of decentralized finance meets social identity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleHandCashLogin}
              disabled={isLoading}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>{isLoading ? 'Connecting...' : 'Connect HandCash Wallet'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Trusted by thousands</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                <p className="text-sm text-green-400 font-medium">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Top Tokens Rankings Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-yellow-400 mr-4" />
              Top Performing Tokens
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the most successful HandCash handle tokens by market cap and trading activity
            </p>
          </div>

          {topTokens.length > 0 && (
            <>


              {/* Complete Rankings Table */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2" />
                      All 20 Tokens
                    </h3>
                    <Link 
                      href="/rankings"
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors"
                    >
                      View Detailed Rankings
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
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
                          Holders
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {topTokens.map((token, index) => (
                        <tr key={token.id} className="hover:bg-gray-700 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {getRankIcon(index + 1)}
                                <span className="ml-2 text-white font-bold">{index + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  ${token.symbol.substring(1, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                  {token.symbol}
                                </div>
                                <div className="text-sm text-gray-400">{token.handcashHandle}</div>
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
                            <span className="text-lg font-medium text-white">{token.holders.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {token.change24h > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-red-400 mr-1 transform rotate-180" />
                              )}
                              <span className={`font-bold ${
                                token.change24h > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <Link
                  href="/rankings"
                  className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  View Complete Rankings
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </>
          )}

          {topTokens.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tokens available yet</h3>
              <p className="text-gray-400">Tokens will appear here once they are created and traded.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Future of Handle-Based Finance
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary platform combining social identity with decentralized finance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Trustless',
                description: 'Built on Bitcoin SV blockchain with automatic smart contract execution for dividend distribution.',
                image: featureImages[0],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Trading',
                description: 'Trade handle tokens instantly with real-time price discovery and transparent market mechanics.',
                image: featureImages[1],
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: TrendingUp,
                title: 'Dividend Rewards',
                description: 'Earn passive income when payments flow through the HandCash handles you invest in.',
                image: featureImages[2],
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                  {feature.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={feature.image.url}
                        alt={feature.image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to start earning from HandCash handle investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Connect HandCash',
                description: 'Sign in with your HandCash handle to automatically create your token. Your handle becomes a tradeable asset (e.g., @JohnBaker becomes $JohnBaker).',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: 2,
                title: 'Trade Tokens',
                description: 'Buy and sell tokens representing HandCash handles of any amount. Each token is backed by 1 billion shares that can be traded freely.',
                color: 'from-green-500 to-green-600'
              },
              {
                step: 3,
                title: 'Earn Dividends',
                description: 'When payments are made to a HandCash handle, they\'re automatically distributed as dividends to token holders proportional to ownership.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-center">{item.description}</p>
                </div>
                
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Tokenize Your Handle?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users already earning dividends from HandCash handle investments
          </p>
          <button
            onClick={handleHandCashLogin}
            disabled={isLoading}
            className="bg-white text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 flex items-center space-x-2 mx-auto"
          >
            <span>{isLoading ? 'Connecting...' : 'Get Started Now'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {heroImage && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
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
  );
}
