import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { handcashHandle } = body;

    if (!handcashHandle) {
      return NextResponse.json(
        { error: 'HandCash handle is required' },
        { status: 400 }
      );
    }

    // Check if user exists and owns this handle
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.handcashHandle !== handcashHandle) {
      return NextResponse.json(
        { error: 'Unauthorized to create token for this handle' },
        { status: 403 }
      );
    }

    // Check if token already exists for this handle
    const existingToken = await prisma.token.findUnique({
      where: { handcashHandle },
    });

    if (existingToken) {
      return NextResponse.json(
        { error: 'Token already exists for this handle' },
        { status: 409 }
      );
    }

    // Create the token
    const symbol = handcashHandle.startsWith('@') 
      ? `$${handcashHandle.slice(1)}` 
      : `$${handcashHandle}`;

    const token = await prisma.token.create({
      data: {
        symbol,
        handcashHandle,
        ownerId: userId,
        description: `Token representing ${handcashHandle} HandCash handle`,
        totalSupply: BigInt(1000000000), // 1 billion tokens
        // TODO: Add BSV token minting logic here
        // bsvTxId: await mintBSVToken(symbol, totalSupply),
      },
    });

    // Create initial token holding for the owner (they get all tokens initially)
    await prisma.tokenHolding.create({
      data: {
        userId: userId,
        tokenId: token.id,
        amount: BigInt(1000000000), // Owner gets all tokens initially
      },
    });

    return NextResponse.json({
      id: token.id,
      symbol: token.symbol,
      handcashHandle: token.handcashHandle,
      totalSupply: token.totalSupply.toString(),
      price: 0.000001, // Starting price
      marketCap: 1000, // Starting market cap
      holders: 1, // Just the owner initially
    });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 