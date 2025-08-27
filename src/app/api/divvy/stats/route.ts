import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    // Get total dividends paid across all tokens
    const totalDividendsResult = await prisma.dividendPayment.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    // Get count of active tokens (tokens that have received payments)
    const activeTokens = await prisma.token.count({
      where: {
        dividendPayments: {
          some: {}
        }
      }
    });

    // Get pending distributions count
    const pendingDistributions = await prisma.dividendDistribution.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get total unique token holders
    const totalHolders = await prisma.tokenHolding.groupBy({
      by: ['userId'],
      _count: true
    }).then(result => result.length);

    const stats = {
      totalDividendsPaid: Number(totalDividendsResult._sum.totalAmount) || 0,
      activeTokens,
      pendingDistributions,
      totalHolders
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching Divvy stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
