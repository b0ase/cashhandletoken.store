import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaymentNotification {
  handcashHandle: string;
  amount: number;
  currency: string;
  txId: string;
  timestamp: string;
}

export async function POST(_request: NextRequest) {
  try {
    const body: PaymentNotification = await request.json();
    const { handcashHandle, amount, currency, txId, timestamp } = body;

    // Validate required fields
    if (!handcashHandle || !amount || !currency || !txId) {
      return NextResponse.json(
        { error: 'Missing required fields: handcashHandle, amount, currency, txId' },
        { status: 400 }
      );
    }

    // Find the token associated with this HandCash handle
    const token = await prisma.token.findUnique({
      where: { handcashHandle },
      include: {
        holdings: {
          include: {
            user: true
          }
        }
      }
    });

    if (!token) {
      return NextResponse.json(
        { error: 'No token found for this HandCash handle' },
        { status: 404 }
      );
    }

    // Calculate total token supply and holder percentages
    const totalSupply = Number(token.totalSupply);
    let totalDistributed = 0;

    // Create dividend payment record
    const dividendPayment = await prisma.dividendPayment.create({
      data: {
        totalAmount: amount,
        paymentTxId: txId,
        distributedAmount: 0,
        remainingAmount: amount,
        tokenId: token.id
      }
    });

    // Calculate dividends for each holder (only holders with > 200,000 tokens)
    const eligibleHolders = token.holdings.filter(holding =>
      Number(holding.amount) > 200000
    );

    for (const holding of eligibleHolders) {
      const holderAmount = Number(holding.amount);
      const dividendAmount = (holderAmount / totalSupply) * amount;

      await prisma.dividendDistribution.create({
        data: {
          amount: dividendAmount,
          status: 'PENDING',
          paymentId: dividendPayment.id
        }
      });

      totalDistributed += dividendAmount;
    }

    // Update the dividend payment with distributed amount
    await prisma.dividendPayment.update({
      where: { id: dividendPayment.id },
      data: {
        distributedAmount: totalDistributed,
        remainingAmount: amount - totalDistributed
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      dividendPaymentId: dividendPayment.id,
      eligibleHolders: eligibleHolders.length,
      totalDistributed,
      remainingAmount: amount - totalDistributed
    });

  } catch (error) {
    console.error('Error processing payment notification:', error);
    return NextResponse.json(
      { error: 'Failed to process payment notification' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Get recent dividend payments
    const recentPayments = await prisma.dividendPayment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        token: true,
        distributions: true
      }
    });

    return NextResponse.json(recentPayments);
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent payments' },
      { status: 500 }
    );
  }
}
