import { HandCashConnect } from '@handcash/handcash-connect';

class HandCashService {
  private handCashConnect: HandCashConnect;

  constructor() {
    // Initialize with mock values for development
    // In production, these should come from environment variables
    this.handCashConnect = new HandCashConnect({
      appId: process.env.HANDCASH_APP_ID || 'your-app-id-here',
      appSecret: process.env.HANDCASH_APP_SECRET || 'your-app-secret-here',
    });
  }

  getRedirectionUrl(customParameters?: Record<string, string>): string {
    try {
      return this.handCashConnect.getRedirectionUrl(customParameters);
    } catch (error) {
      console.error('Error getting HandCash redirection URL:', error);
      // Return a mock URL for development
      return `http://localhost:3000/auth/handcash/callback?authToken=mock-token&${new URLSearchParams(customParameters || {})}`;
    }
  }

  async getUserProfile(authToken: string) {
    try {
      const account = this.handCashConnect.getAccountFromAuthToken(authToken);
      const { publicProfile } = await account.profile.getCurrentProfile();
      return {
        handcashHandle: publicProfile.handle,
        displayName: publicProfile.displayName,
        profilePictureUrl: publicProfile.avatarUrl,
      };
    } catch (error) {
      console.error('Error getting HandCash user profile:', error);
      // Return mock data for development
      if (authToken === 'mock-token') {
        return {
          handcashHandle: '@DemoUser',
          displayName: 'Demo User',
          profilePictureUrl: 'https://via.placeholder.com/100',
        };
      }
      throw error;
    }
  }

  async getSpendableBalance(authToken: string) {
    try {
      const account = this.handCashConnect.getAccountFromAuthToken(authToken);
      return await account.wallet.getSpendableBalance();
    } catch (error) {
      console.error('Error getting spendable balance:', error);
      // Return mock balance for development
      return { currencyCode: 'USD', spendableAmount: 100 };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async makePayment(authToken: string, paymentParameters: any) {
    try {
      const account = this.handCashConnect.getAccountFromAuthToken(authToken);
      return await account.wallet.pay(paymentParameters);
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }
}

export const handCashService = new HandCashService(); 