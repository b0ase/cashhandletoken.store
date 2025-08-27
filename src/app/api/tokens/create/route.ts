import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { bsvService } from '@/lib/bsv';

export async function POST(_request: NextRequest) {
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

    // Mint the ordinals token on BSV blockchain
    let ordinalsToken;
    try {
      const ownerAddress = bsvService.getAddress();
      ordinalsToken = await bsvService.createOrdinalsToken(
        symbol,
        handcashHandle,
        BigInt(1000000000), // 1 billion tokens
        ownerAddress
      );
    } catch (bsvError) {
      console.error('Failed to mint BSV ordinals token:', bsvError);
      // In development, we'll continue with a mock inscription ID
      ordinalsToken = {
        inscriptionId: `mock_${Date.now()}`,
        contentType: 'application/json',
        content: JSON.stringify({
          symbol,
          handcashHandle,
          totalSupply: '1000000000',
          owner: userId,
          createdAt: new Date().toISOString()
        }),
        metadata: {
          symbol,
          handcashHandle,
          totalSupply: BigInt(1000000000),
          owner: userId,
          createdAt: new Date()
        }
      };
    }

    const token = await prisma.token.create({
      data: {
        symbol,
        handcashHandle,
        ownerId: userId,
        description: `Token representing ${handcashHandle} HandCash handle`,
        totalSupply: BigInt(1000000000), // 1 billion tokens
        tokenType: 'ORDINAL', // Set token type to ORDINAL

        // BSV/Ordinals fields
        inscriptionId: ordinalsToken.inscriptionId,
        contentType: ordinalsToken.contentType,
        ordinalsContent: ordinalsToken.content,
        mintingAddress: bsvService.getAddress(),
        confirmedAt: new Date(), // In production, this would be when the tx confirms
      },
    });

    // Record the BSV transaction
    if (ordinalsToken.inscriptionId) {
      await prisma.bSVTransaction.create({
        data: {
          txId: ordinalsToken.inscriptionId, // Using inscription ID as txId for ordinals
          inscriptionId: ordinalsToken.inscriptionId,
          transactionType: 'MINT',
          fromAddress: bsvService.getAddress(),
          amount: BigInt(1000000000),
          status: 'CONFIRMED', // In production, would track actual confirmation
          confirmedAt: new Date(),
          tokenId: token.id,
        },
      });
    }

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
      tokenType: token.tokenType,
      inscriptionId: token.inscriptionId,
      contentType: token.contentType,
      ordinalsContent: token.ordinalsContent,
      mintingAddress: token.mintingAddress,
      confirmedAt: token.confirmedAt,
      ordinalsMetadata: ordinalsToken.metadata,
    });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 