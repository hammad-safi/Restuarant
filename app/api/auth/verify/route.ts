import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const decoded = getAuthUser(req);

    if (!decoded) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 }));
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true
      }
    });

    if (!user) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 401 }));
    }

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: { user }
    }));
  } catch (error: any) {
    console.error('Verify error:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message
    }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
