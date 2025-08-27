import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    // Get all tokens with their dividend information
    const tokens = await prisma.token.findMany({
      include: {
        owner: true,
        holdings: true,
        dividendPayments: {
          select: {
            totalAmount: true,
            createdAt: true
          }
        }
      }
    });

    // Calculate rankings data with dividend information
    const rankings = tokens.map(token => {
      const totalDividendsPaid = token.dividendPayments.reduce(
        (sum, payment) => sum + Number(payment.totalAmount),
        0
      );

      const dividendPayments = token.dividendPayments.length;

      // Calculate holder count
      const holders = token.holdings.length;

      // Mock market data (in a real app, this would come from trading data)
      const mockPrice = Math.random() * 0.01;
      const marketCap = Number(token.totalSupply) * mockPrice;
      const volume24h = marketCap * (Math.random() * 0.1);
      const change24h = (Math.random() - 0.5) * 20;

      return {
        id: token.id,
        symbol: token.symbol,
        handcashHandle: token.handcashHandle,
        price: mockPrice,
        marketCap,
        holders,
        volume24h,
        change24h,
        totalDividendsPaid,
        dividendPayments,
        owner: {
          displayName: token.owner.displayName || 'Anonymous',
          profilePictureUrl: token.owner.profilePictureUrl
        }
      };
    });

    // Sort by total dividends paid (descending) to show most profitable tokens first
    const sortedRankings = rankings.sort((a, b) => b.totalDividendsPaid - a.totalDividendsPaid);

    return NextResponse.json(sortedRankings);
  } catch (error) {
    console.error('Error fetching Divvy rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
