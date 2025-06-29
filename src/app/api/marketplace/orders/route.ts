import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const MINIMUM_TRANCHE = 200000; // 1 billion ÷ 5000

export async function GET() {
  try {
    const sellOrders = await prisma.sellOrder.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        seller: {
          select: {
            handcashHandle: true,
            displayName: true,
          },
        },
        token: {
          select: {
            symbol: true,
            handcashHandle: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sellOrders);
  } catch (error) {
    console.error('Error fetching sell orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { tokenSymbol, amount, pricePerToken } = body;

    if (!tokenSymbol || !amount || !pricePerToken) {
      return NextResponse.json(
        { error: 'Token symbol, amount, and price are required' },
        { status: 400 }
      );
    }

    if (amount < MINIMUM_TRANCHE) {
      return NextResponse.json(
        { error: `Minimum sell amount is ${MINIMUM_TRANCHE.toLocaleString()} tokens` },
        { status: 400 }
      );
    }

    // Find the token
    const token = await prisma.token.findUnique({
      where: { symbol: tokenSymbol },
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    // Check if user has enough tokens
    const userHolding = await prisma.tokenHolding.findUnique({
      where: {
        userId_tokenId: {
          userId: userId,
          tokenId: token.id,
        },
      },
    });

    if (!userHolding || userHolding.amount < BigInt(amount)) {
      return NextResponse.json(
        { error: 'Insufficient token balance' },
        { status: 400 }
      );
    }

    const totalValue = amount * pricePerToken;

    // Create sell order
    const sellOrder = await prisma.sellOrder.create({
      data: {
        sellerId: userId,
        tokenId: token.id,
        amount: BigInt(amount),
        pricePerToken,
        totalValue,
      },
      include: {
        seller: {
          select: {
            handcashHandle: true,
            displayName: true,
          },
        },
        token: {
          select: {
            symbol: true,
            handcashHandle: true,
          },
        },
      },
    });

    return NextResponse.json(sellOrder);
  } catch (error) {
    console.error('Error creating sell order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 