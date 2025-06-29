import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { orderId } = await params;

    // Find the sell order
    const sellOrder = await prisma.sellOrder.findUnique({
      where: { id: orderId },
      include: {
        seller: true,
        token: true,
      },
    });

    if (!sellOrder) {
      return NextResponse.json(
        { error: 'Sell order not found' },
        { status: 404 }
      );
    }

    if (sellOrder.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Sell order is no longer active' },
        { status: 400 }
      );
    }

    if (sellOrder.sellerId === userId) {
      return NextResponse.json(
        { error: 'Cannot buy your own tokens' },
        { status: 400 }
      );
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Mark the sell order as filled
      const updatedSellOrder = await tx.sellOrder.update({
        where: { id: orderId },
        data: { status: 'FILLED' },
      });

      // Reduce seller's token holding
      const sellerHolding = await tx.tokenHolding.findUnique({
        where: {
          userId_tokenId: {
            userId: sellOrder.sellerId,
            tokenId: sellOrder.tokenId,
          },
        },
      });

      if (!sellerHolding || sellerHolding.amount < sellOrder.amount) {
        throw new Error('Seller has insufficient tokens');
      }

      await tx.tokenHolding.update({
        where: {
          userId_tokenId: {
            userId: sellOrder.sellerId,
            tokenId: sellOrder.tokenId,
          },
        },
        data: {
          amount: sellerHolding.amount - sellOrder.amount,
        },
      });

      // Create or update buyer's token holding
      const existingBuyerHolding = await tx.tokenHolding.findUnique({
        where: {
          userId_tokenId: {
            userId: userId,
            tokenId: sellOrder.tokenId,
          },
        },
      });

      if (existingBuyerHolding) {
        await tx.tokenHolding.update({
          where: {
            userId_tokenId: {
              userId: userId,
              tokenId: sellOrder.tokenId,
            },
          },
          data: {
            amount: existingBuyerHolding.amount + sellOrder.amount,
          },
        });
      } else {
        await tx.tokenHolding.create({
          data: {
            userId: userId,
            tokenId: sellOrder.tokenId,
            amount: sellOrder.amount,
          },
        });
      }

      // Create buy order record for tracking
      await tx.buyOrder.create({
        data: {
          buyerId: userId,
          tokenId: sellOrder.tokenId,
          amount: sellOrder.amount,
          pricePerToken: sellOrder.pricePerToken,
          totalValue: sellOrder.totalValue,
          status: 'FILLED',
        },
      });

      return updatedSellOrder;
    });

    // TODO: Here you would integrate with HandCash to process the actual payment
    // For now, we're just updating the database records
    
    return NextResponse.json({
      success: true,
      message: 'Purchase completed successfully',
      orderId: result.id,
    });
  } catch (error) {
    console.error('Error buying tokens:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 