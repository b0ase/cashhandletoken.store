'use client';

import { useState } from 'react';
import { ArrowRight, DollarSign, Shield, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'handcash' | 'success'>('form');
  const [formData, setFormData] = useState({
    handle: '',
    description: '',
    category: '',
    website: '',
    socialLinks: {
      twitter: '',
      discord: '',
      telegram: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form processing
    setTimeout(() => {
      setStep('handcash');
      setIsLoading(false);
    }, 1500);
  };

  const handleHandCashAuth = async () => {
    setIsLoading(true);
    
    // Simulate HandCash authentication
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 2000);
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-green-400" />,
      title: 'Monetize Your Handle',
      description: 'Earn from payments sent to your HandCash handle'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: 'Build Community',
      description: 'Create a loyal following of token holders'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      title: 'Grow Value',
      description: 'Increase your handle&apos;s market value over time'
    },
    {
      icon: <Shield className="h-6 w-6 text-yellow-400" />,
      title: 'Secure & Transparent',
      description: 'Built on Bitcoin SV for maximum security'
    }
  ];

  if (step === 'handcash') {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Connect Your HandCash Wallet
            </h1>
            <p className="text-xl text-gray-300">
              Sign in with HandCash to register your handle and start tokenizing
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Registering: ${formData.handle}
              </h2>
              <p className="text-gray-400">
                You&apos;ll be redirected to HandCash to complete authentication
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Handle Details</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Handle: <span className="text-white font-medium">${formData.handle}</span></div>
                  <div>Category: <span className="text-white font-medium">{formData.category}</span></div>
                  <div>Description: <span className="text-white font-medium">{formData.description}</span></div>
                </div>
              </div>

              <button
                onClick={handleHandCashAuth}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connecting to HandCash...
                  </div>
                ) : (
                  <>
                    <DollarSign className="h-5 w-5 mr-2" />
                    Sign in with HandCash
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep('form')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Handle Registered Successfully!
            </h1>
            <p className="text-xl text-gray-300">
              Your HandCash handle is now tokenized and available for trading
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                ${formData.handle} is now live!
              </h2>
              <p className="text-gray-400">
                Your handle has been successfully registered and tokenized
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <div className="flex items-center text-green-400 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Registration Complete</span>
                </div>
                <p className="text-green-300 text-sm">
                  Your handle is now available for users to purchase tokens and start earning from payments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href={`/rankings`}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                >
                  View Rankings
                </Link>
                <Link
                  href={`/marketplace`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Go to Marketplace
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Register Your HandCash Handle
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tokenize your HandCash handle and start earning from payments. Create a new token that represents your handle and distribute it to your community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Why Tokenize?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Handle Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="handle" className="block text-sm font-medium text-gray-300 mb-2">
                    HandCash Handle *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg">$</span>
                    </div>
                    <input
                      type="text"
                      id="handle"
                      value={formData.handle}
                      onChange={(e) => handleInputChange('handle', e.target.value)}
                      className="block w-full pl-8 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="yourhandle"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Enter your handle without the $ symbol
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what your handle represents and why people should invest in it..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Finance">Finance</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                    <option value="Art">Art & Creative</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter (Optional)
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label htmlFor="discord" className="block text-sm font-medium text-gray-300 mb-2">
                      Discord (Optional)
                    </label>
                    <input
                      type="text"
                      id="discord"
                      value={formData.socialLinks.discord}
                      onChange={(e) => handleInputChange('socialLinks.discord', e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="username#1234"
                    />
                  </div>
                  <div>
                    <label htmlFor="telegram" className="block text-sm font-medium text-gray-300 mb-2">
                      Telegram (Optional)
                    </label>
                    <input
                      type="text"
                      id="telegram"
                      value={formData.socialLinks.telegram}
                      onChange={(e) => handleInputChange('socialLinks.telegram', e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-300">
                      <p className="font-medium mb-1">Important Information</p>
                      <p>By registering your handle, you agree to our terms of service. You&apos;ll need to authenticate with HandCash to complete the registration process.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Continue to HandCash Auth
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
