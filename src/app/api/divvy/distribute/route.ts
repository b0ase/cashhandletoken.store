import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { handCashService } from '@/lib/handcash';

const prisma = new PrismaClient();

export async function POST(_request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 }
      );
    }

    // Get the dividend payment and its distributions
    const dividendPayment = await prisma.dividendPayment.findUnique({
      where: { id: paymentId },
      include: {
        token: true,
        distributions: {
          where: { status: 'PENDING' }
        }
      }
    });

    if (!dividendPayment) {
      return NextResponse.json(
        { error: 'Dividend payment not found' },
        { status: 404 }
      );
    }

    // Get user's auth token for HandCash payments
    // This would typically come from the request or session
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Process distributions in batches
    const batchSize = 10; // Process 10 distributions at a time
    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < dividendPayment.distributions.length; i += batchSize) {
      const batch = dividendPayment.distributions.slice(i, i + batchSize);

      // Process each distribution in the batch
      for (const distribution of batch) {
        try {
          processed++;

          // In a real implementation, you would need to:
          // 1. Get the holder's HandCash handle from their token holding
          // 2. Send the payment via HandCash
          // 3. Update the distribution status

          // For now, we'll simulate the payment process
          const mockTxId = `divvy_${dividendPayment.id}_${distribution.id}`;

          await prisma.dividendDistribution.update({
            where: { id: distribution.id },
            data: {
              status: 'COMPLETED',
              txId: mockTxId
            }
          });

          successful++;
        } catch (error) {
          console.error(`Failed to process distribution ${distribution.id}:`, error);

          await prisma.dividendDistribution.update({
            where: { id: distribution.id },
            data: {
              status: 'FAILED'
            }
          });

          failed++;
        }
      }

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < dividendPayment.distributions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Batch distribution completed',
      processed,
      successful,
      failed,
      paymentId
    });

  } catch (error) {
    console.error('Error processing batch distribution:', error);
    return NextResponse.json(
      { error: 'Failed to process batch distribution' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Get pending distributions for manual processing
    const pendingDistributions = await prisma.dividendDistribution.findMany({
      where: { status: 'PENDING' },
      include: {
        payment: {
          include: {
            token: true
          }
        }
      },
      take: 50,
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      pendingDistributions,
      count: pendingDistributions.length
    });
  } catch (error) {
    console.error('Error fetching pending distributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending distributions' },
      { status: 500 }
    );
  }
}
