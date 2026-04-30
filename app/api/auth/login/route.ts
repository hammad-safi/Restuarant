import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken, addCorsHeaders } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 }));
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        username,
        is_active: true
      }
    });

    if (!user) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 }));
    }

    // Check password
    let isValidPassword = false;
    if (user.password_hash.startsWith('$2a$')) {
      isValidPassword = await comparePassword(password, user.password_hash);
    } else {
      isValidPassword = password === user.password_hash;
    }

    if (!isValidPassword) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 }));
    }

    // Generate token
    const token = generateToken(user);

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      }
    }));
  } catch (error: any) {
    console.error('Login error:', error);
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
