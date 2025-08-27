/**
 * Divvy Payment Monitor Service
 * 
 * This service monitors HandCash handles for incoming payments
 * and automatically distributes dividends to token holders.
 */

import { PrismaClient } from '@prisma/client';
import { handCashService } from '@/lib/handcash';

const prisma = new PrismaClient();

interface PaymentWebhook {
  handcashHandle: string;
  amount: number;
  currency: string;
  txId: string;
  fromHandle: string;
  timestamp: Date;
}

interface TokenHolder {
  userId: string;
  handcashHandle: string;
  tokenAmount: bigint;
  percentage: number;
}

export class DivvyMonitorService {
  private monitoringInterval: NodeJS.Timer | null = null;
  private processingQueue: Map<string, Promise<void>> = new Map();

  /**
   * Start monitoring all registered HandCash handles
   */
  async start() {
    console.log('Starting Divvy Monitor Service...');
    
    // Set up webhook listeners for all registered handles
    await this.setupWebhooks();
    
    // Start polling as fallback (every 60 seconds)
    this.monitoringInterval = setInterval(() => {
      this.checkAllPayments();
    }, 60000);
    
    console.log('Divvy Monitor Service started successfully');
  }

  /**
   * Stop the monitoring service
   */
  async stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    // Wait for all processing to complete
    await Promise.all(this.processingQueue.values());
    
    console.log('Divvy Monitor Service stopped');
  }

  /**
   * Set up webhook listeners for all registered handles
   */
  private async setupWebhooks() {
    try {
      // Get all tokens with Divvy enabled
      const tokens = await prisma.token.findMany({
        where: {
          // Add a divvyEnabled field to your Token model
          // divvyEnabled: true
        },
        include: {
          owner: true
        }
      });

      for (const token of tokens) {
        try {
          // Register webhook for this handle
          // Note: This is conceptual - HandCash webhook API details needed
          await this.registerWebhook(token.handcashHandle);
        } catch (error) {
          console.error(`Failed to register webhook for ${token.handcashHandle}:`, error);
        }
      }
    } catch (error) {
      console.error('Error setting up webhooks:', error);
    }
  }

  /**
   * Register a webhook for a specific HandCash handle
   */
  private async registerWebhook(handle: string) {
    // This would use the HandCash API to register a webhook
    // Implementation depends on HandCash webhook API
    console.log(`Registering webhook for ${handle}`);
    
    // Conceptual implementation:
    // await handCashService.registerWebhook({
    //   handle,
    //   url: `${process.env.APP_URL}/api/divvy/webhook`,
    //   events: ['payment.received']
    // });
  }

  /**
   * Handle incoming payment webhook
   */
  async handlePaymentWebhook(webhook: PaymentWebhook) {
    const { handcashHandle, amount, txId } = webhook;
    
    // Prevent duplicate processing
    if (this.processingQueue.has(txId)) {
      console.log(`Payment ${txId} already being processed`);
      return;
    }

    // Add to processing queue
    const processingPromise = this.processPayment(webhook);
    this.processingQueue.set(txId, processingPromise);

    try {
      await processingPromise;
    } finally {
      this.processingQueue.delete(txId);
    }
  }

  /**
   * Process a payment and distribute dividends
   */
  private async processPayment(payment: PaymentWebhook) {
    const { handcashHandle, amount, txId } = payment;
    
    try {
      console.log(`Processing payment ${txId} for ${handcashHandle}: $${amount}`);
      
      // Check if already processed
      const existingPayment = await prisma.dividendPayment.findFirst({
        where: { paymentTxId: txId }
      });
      
      if (existingPayment) {
        console.log(`Payment ${txId} already processed`);
        return;
      }

      // Get token for this handle
      const token = await prisma.token.findUnique({
        where: { handcashHandle },
        include: {
          holdings: {
            include: {
              user: true
            }
          }
        }
      });

      if (!token) {
        console.error(`No token found for handle ${handcashHandle}`);
        return;
      }

      // Calculate token holder distributions
      const holders = await this.calculateDistributions(token, amount);
      
      // Create dividend payment record
      const dividendPayment = await prisma.dividendPayment.create({
        data: {
          tokenId: token.id,
          totalAmount: amount,
          paymentTxId: txId,
          distributedAmount: 0,
          remainingAmount: amount
        }
      });

      // Execute distributions
      let totalDistributed = 0;
      const distributions = [];

      for (const holder of holders) {
        if (holder.percentage > 0 && holder.tokenAmount > BigInt(200000)) {
          const distributionAmount = (amount * holder.percentage) / 100;
          
          // Create distribution record
          const distribution = await prisma.dividendDistribution.create({
            data: {
              paymentId: dividendPayment.id,
              amount: distributionAmount,
              status: 'PENDING'
            }
          });

          distributions.push({
            distribution,
            holder,
            amount: distributionAmount
          });

          totalDistributed += distributionAmount;
        }
      }

      // Process distributions in batches
      await this.executeDistributions(distributions);

      // Update payment record
      await prisma.dividendPayment.update({
        where: { id: dividendPayment.id },
        data: {
          distributedAmount: totalDistributed,
          remainingAmount: amount - totalDistributed
        }
      });

      console.log(`Successfully distributed $${totalDistributed} to ${distributions.length} holders`);
      
    } catch (error) {
      console.error(`Error processing payment ${txId}:`, error);
      
      // Log failed payment for manual review
      await prisma.dividendPayment.create({
        data: {
          tokenId: (await prisma.token.findUnique({ where: { handcashHandle } }))?.id || '',
          totalAmount: amount,
          paymentTxId: txId,
          distributedAmount: 0,
          remainingAmount: amount
        }
      });
    }
  }

  /**
   * Calculate distribution amounts for token holders
   */
  private async calculateDistributions(token: any, totalAmount: number): Promise<TokenHolder[]> {
    const totalSupply = Number(token.totalSupply);
    const holders: TokenHolder[] = [];

    for (const holding of token.holdings) {
      const percentage = (Number(holding.amount) / totalSupply) * 100;
      
      holders.push({
        userId: holding.userId,
        handcashHandle: holding.user.handcashHandle,
        tokenAmount: holding.amount,
        percentage
      });
    }

    return holders;
  }

  /**
   * Execute dividend distributions to holders
   */
  private async executeDistributions(distributions: any[]) {
    // Process in batches of 10
    const batchSize = 10;
    
    for (let i = 0; i < distributions.length; i += batchSize) {
      const batch = distributions.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async ({ distribution, holder, amount }) => {
        try {
          // Execute payment via HandCash
          // This requires the business wallet or pre-signed transaction
          const paymentResult = await this.sendPayment(
            holder.handcashHandle,
            amount
          );

          // Update distribution status
          await prisma.dividendDistribution.update({
            where: { id: distribution.id },
            data: {
              status: 'COMPLETED',
              txId: paymentResult.txId
            }
          });
          
        } catch (error) {
          console.error(`Failed to send payment to ${holder.handcashHandle}:`, error);
          
          await prisma.dividendDistribution.update({
            where: { id: distribution.id },
            data: {
              status: 'FAILED'
            }
          });
        }
      }));

      // Small delay between batches
      if (i + batchSize < distributions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Send payment to a HandCash handle
   */
  private async sendPayment(handle: string, amount: number): Promise<{ txId: string }> {
    // This would use the HandCash business wallet to send payments
    // Implementation depends on your wallet setup
    
    // Option 1: Business Wallet (Custodial)
    // const result = await handCashService.makePayment(
    //   process.env.DIVVY_BUSINESS_AUTH_TOKEN,
    //   {
    //     destination: handle,
    //     amount,
    //     currencyCode: 'USD'
    //   }
    // );

    // Option 2: Pre-signed transactions
    // Implementation would use stored templates

    // For now, return mock transaction
    console.log(`Sending $${amount} to ${handle}`);
    return {
      txId: `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Fallback: Check all registered handles for new payments
   */
  private async checkAllPayments() {
    try {
      const tokens = await prisma.token.findMany({
        // where: { divvyEnabled: true }
      });

      for (const token of tokens) {
        // Check for new payments since last check
        // This would query HandCash API for recent transactions
        // await this.checkHandlePayments(token.handcashHandle);
      }
    } catch (error) {
      console.error('Error checking payments:', error);
    }
  }
}

// Export singleton instance
export const divvyMonitor = new DivvyMonitorService();