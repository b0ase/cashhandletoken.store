import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const handcashHandle = decodeURIComponent(handle);

    const token = await prisma.token.findUnique({
      where: { handcashHandle },
      include: {
        holdings: true,
        owner: {
          select: {
            handcashHandle: true,
            displayName: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    // Calculate basic stats
    const holders = token.holdings.length;
    const price = 0.000001; // TODO: Calculate actual price based on trades
    const marketCap = Number(token.totalSupply) * price;

    return NextResponse.json({
      id: token.id,
      symbol: token.symbol,
      handcashHandle: token.handcashHandle,
      totalSupply: token.totalSupply.toString(),
      description: token.description,
      price,
      marketCap,
      holders,
      owner: token.owner,
      createdAt: token.createdAt,
    });
  } catch (error) {
    console.error('Error getting user token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 