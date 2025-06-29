import { NextResponse } from 'next/server';
import { handCashService } from '@/lib/handcash';

export async function GET() {
  try {
    const redirectionUrl = handCashService.getRedirectionUrl();
    return NextResponse.redirect(redirectionUrl);
  } catch (error) {
    console.error('Error initiating HandCash login:', error);
    return NextResponse.json(
      { error: 'Failed to initiate HandCash login' },
      { status: 500 }
    );
  }
} 