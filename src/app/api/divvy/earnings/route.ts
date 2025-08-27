import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    // Get user from session or auth token
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // In a real implementation, you'd verify the auth token and get the user
    // For now, we'll use a mock user ID
    const userId = 'mock-user-id'; // This should come from auth verification

    // Get user's token holdings
    const userHoldings = await prisma.tokenHolding.findMany({
      where: { userId },
      include: {
        token: {
          include: {
            dividendPayments: {
              include: {
                distributions: {
                  where: {
                    // This is a simplified query - in reality you'd need to link
                    // distributions to specific holdings
                  }
                }
              }
            }
          }
        }
      }
    });

    // Calculate earnings from each token
    const earnings = userHoldings.map(holding => {
      const token = holding.token;
      const totalDividends = token.dividendPayments.reduce((sum, payment) => {
        return sum + Number(payment.totalAmount);
      }, 0);

      const holdingAmount = Number(holding.amount);
      const totalSupply = Number(token.totalSupply);
      const ownershipPercentage = (holdingAmount / totalSupply) * 100;
      const estimatedEarnings = (holdingAmount / totalSupply) * totalDividends;

      return {
        tokenId: token.id,
        tokenSymbol: token.symbol,
        holdingAmount,
        ownershipPercentage,
        totalDividendsPaid: totalDividends,
        estimatedEarnings,
        dividendPayments: token.dividendPayments.length
      };
    });

    const totalEarnings = earnings.reduce((sum, token) => sum + token.estimatedEarnings, 0);

    return NextResponse.json({
      earnings,
      totalEarnings,
      totalTokens: earnings.length
    });

  } catch (error) {
    console.error('Error fetching dividend earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dividend earnings' },
      { status: 500 }
    );
  }
}
