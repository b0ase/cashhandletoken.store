import { NextRequest, NextResponse } from 'next/server';
import { handCashService } from '@/lib/handcash';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(_request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authToken = searchParams.get('authToken');

    if (!authToken) {
      return NextResponse.redirect(new URL('/?error=no-auth-token', request.url));
    }

    // Get user profile from HandCash
    const userProfile = await handCashService.getUserProfile(authToken);

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { handcashHandle: userProfile.handcashHandle },
      update: {
        authToken,
        displayName: userProfile.displayName,
        profilePictureUrl: userProfile.profilePictureUrl,
      },
      create: {
        handcashHandle: userProfile.handcashHandle,
        authToken,
        displayName: userProfile.displayName,
        profilePictureUrl: userProfile.profilePictureUrl,
      },
    });

    // Set user session cookie
    const cookieStore = await cookies();
    cookieStore.set('user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Redirect to user dashboard after successful login
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error in HandCash callback:', error);
    return NextResponse.redirect(new URL('/?error=auth-failed', request.url));
  }
} 