'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, AlertCircle, CheckCircle, Clock, ArrowRight, Key } from 'lucide-react';

interface PendingDistribution {
  id: string;
  incomingAmount: number;
  fromHandle: string;
  incomingTxId: string;
  distributions: {
    handle: string;
    amount: number;
    percentage: number;
  }[];
  createdAt: Date;
  status: 'AWAITING_SIGNATURE' | 'SIGNED' | 'EXECUTED';
}

export default function DivvyDistributions() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingBatches, setPendingBatches] = useState<PendingDistribution[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<PendingDistribution | null>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await loadPendingDistributions();
      } else {
        window.location.href = '/divvy';
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingDistributions = async () => {
    try {
      const response = await fetch('/api/divvy/pending');
      if (response.ok) {
        const batches = await response.json();
        setPendingBatches(batches);
      }
    } catch (error) {
      console.error('Error loading pending distributions:', error);
    }
  };

  const handleSignDistribution = async (batch: PendingDistribution) => {
    setSigning(true);
    setSelectedBatch(batch);

    try {
      // This would trigger HandCash signing flow
      // In reality, this would open HandCash wallet for user to sign
      
      // Mock signing process
      alert(`
        HandCash Signing Request:
        
        You are about to sign ${batch.distributions.length} payments
        Total amount: $${batch.incomingAmount}
        
        This will open your HandCash wallet to sign each payment.
        
        Recipients:
        ${batch.distributions.map(d => `- ${d.handle}: $${d.amount.toFixed(2)} (${d.percentage.toFixed(2)}%)`).join('\n')}
      `);

      // In production, this would:
      // 1. Open HandCash wallet
      // 2. User signs each transaction
      // 3. Return signed transactions
      // 4. Execute distributions

      const response = await fetch('/api/divvy/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId: batch.id,
          // In reality, signed transactions would be included
        }),
      });

      if (response.ok) {
        alert('Distributions signed and sent successfully!');
        await loadPendingDistributions();
        setSelectedBatch(null);
      } else {
        alert('Failed to sign distributions');
      }
    } catch (error) {
      console.error('Error signing distributions:', error);
      alert('Error signing distributions');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Distributions...</div>
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
            Dividend Distributions
          </h1>
          <p className="text-gray-300">
            Review and sign pending dividend distributions for {user.handcashHandle}
          </p>
        </div>

        {/* Key Concept Box */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Key className="h-6 w-6 text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">You Control Your Funds</h3>
              <p className="text-blue-300">
                Divvy calculates how to distribute incoming payments to your token holders, but YOU must sign each distribution 
                with your HandCash wallet. We never have access to your funds or private keys.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Distributions */}
        {pendingBatches.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Pending Distributions ({pendingBatches.length})
            </h2>

            {pendingBatches.map(batch => (
              <div key={batch.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-medium">Awaiting Your Signature</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Payment from {batch.fromHandle}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Received {new Date(batch.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${batch.incomingAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      to {batch.distributions.length} holders
                    </p>
                  </div>
                </div>

                {/* Distribution Preview */}
                <div className="bg-gray-900 rounded p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Distribution Breakdown</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {batch.distributions.slice(0, 5).map((dist, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{dist.handle}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">{dist.percentage.toFixed(2)}%</span>
                          <span className="text-white font-medium">${dist.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    {batch.distributions.length > 5 && (
                      <p className="text-gray-500 text-sm">
                        ...and {batch.distributions.length - 5} more recipients
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSignDistribution(batch)}
                    disabled={signing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    {signing && selectedBatch?.id === batch.id ? (
                      'Opening HandCash...'
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Sign & Distribute
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      // View detailed breakdown
                      window.location.href = `/divvy/distributions/${batch.id}`;
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Pending Distributions
            </h2>
            <p className="text-gray-300">
              All dividend distributions are up to date. New distributions will appear here when you receive payments.
            </p>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-gray-800 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">How Distribution Signing Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Payment Received</h3>
                  <p className="text-gray-400 text-sm">
                    Someone sends payment to your HandCash handle
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Divvy Calculates</h3>
                  <p className="text-gray-400 text-sm">
                    We calculate fair distribution based on token holdings
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">You Review & Sign</h3>
                  <p className="text-gray-400 text-sm">
                    Review the distribution and sign with your HandCash wallet
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Holders Get Paid</h3>
                  <p className="text-gray-400 text-sm">
                    Dividends are sent directly from your wallet to holders
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Important:</strong> Divvy never has access to your funds. 
              All payments are signed and sent directly from your HandCash wallet. We only facilitate 
              the calculation and provide the signing interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}