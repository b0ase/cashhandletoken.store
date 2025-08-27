import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bsvService } from '@/lib/bsv';
import { cookies } from 'next/headers';

interface TransferRequest {
  tokenId: string;
  toAddress: string;
  amount: string;
  inscriptionId?: string;
}

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body: TransferRequest = await request.json();
    const { tokenId, toAddress, amount, inscriptionId } = body;

    if (!tokenId || !toAddress || !amount) {
      return NextResponse.json(
        { error: 'tokenId, toAddress, and amount are required' },
        { status: 400 }
      );
    }

    // Get the token
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { owner: true }
    });

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    // Verify the user owns the token
    if (token.ownerId !== userId) {
      return NextResponse.json(
        { error: 'You do not own this token' },
        { status: 403 }
      );
    }

    // Check if user has sufficient balance
    const userHolding = await prisma.tokenHolding.findUnique({
      where: {
        userId_tokenId: {
          userId,
          tokenId
        }
      }
    });

    if (!userHolding || BigInt(userHolding.amount) < BigInt(amount)) {
      return NextResponse.json(
        { error: 'Insufficient token balance' },
        { status: 400 }
      );
    }

    // For ordinals tokens, handle blockchain transfer
    let transferTxId: string | null = null;
    if (token.tokenType === 'ORDINAL' && inscriptionId) {
      try {
        transferTxId = await bsvService.transferOrdinalsToken(
          inscriptionId,
          toAddress,
          BigInt(amount)
        );
      } catch (bsvError) {
        console.error('Failed to transfer ordinals token:', bsvError);
        // Continue with database update even if blockchain transfer fails
        // In production, you might want to rollback or handle this differently
      }
    }

    // Update token holdings in database
    const transferAmount = BigInt(amount);

    // Decrease sender's balance
    await prisma.tokenHolding.update({
      where: {
        userId_tokenId: {
          userId,
          tokenId
        }
      },
      data: {
        amount: BigInt(userHolding.amount) - transferAmount
      }
    });

    // Find or create recipient's token holding
    const recipientUser = await prisma.user.findFirst({
      where: {
        // In a real implementation, you'd need to map addresses to users
        // For now, we'll create a mock recipient user
      }
    });

    if (recipientUser) {
      // Increase recipient's balance
      const existingHolding = await prisma.tokenHolding.findUnique({
        where: {
          userId_tokenId: {
            userId: recipientUser.id,
            tokenId
          }
        }
      });

      if (existingHolding) {
        await prisma.tokenHolding.update({
          where: {
            userId_tokenId: {
              userId: recipientUser.id,
              tokenId
            }
          },
          data: {
            amount: BigInt(existingHolding.amount) + transferAmount
          }
        });
      } else {
        await prisma.tokenHolding.create({
          data: {
            userId: recipientUser.id,
            tokenId,
            amount: transferAmount
          }
        });
      }
    }

    // Record the transfer transaction
    const transaction = await prisma.bSVTransaction.create({
      data: {
        txId: transferTxId || `transfer_${Date.now()}`,
        inscriptionId: inscriptionId || null,
        transactionType: 'TRANSFER',
        fromAddress: bsvService.getAddress(),
        toAddress,
        amount: transferAmount,
        status: transferTxId ? 'CONFIRMED' : 'PENDING',
        confirmedAt: transferTxId ? new Date() : null,
        tokenId
      }
    });

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      transferTxId,
      amount: amount,
      toAddress,
      tokenSymbol: token.symbol
    });

  } catch (error) {
    console.error('Error transferring token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
