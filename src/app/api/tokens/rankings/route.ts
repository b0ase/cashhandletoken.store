import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      include: {
        owner: {
          select: {
            displayName: true,
            profilePictureUrl: true,
          },
        },
        holdings: true,
        _count: {
          select: {
            holdings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const rankings = tokens.map((token) => {
      // Mock data for demo purposes
      const price = Math.random() * 0.001 + 0.000001;
      const marketCap = Number(token.totalSupply) * price;
      const volume24h = Math.random() * 10000;
      const change24h = (Math.random() - 0.5) * 20; // -10% to +10%
      const holders = token._count.holdings;

      return {
        id: token.id,
        symbol: token.symbol,
        handcashHandle: token.handcashHandle,
        price,
        marketCap,
        holders,
        volume24h,
        change24h,
        owner: token.owner,
      };
    });

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Error fetching token rankings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 