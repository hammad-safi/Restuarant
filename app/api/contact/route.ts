import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addCorsHeaders } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return addCorsHeaders(NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      ));
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    }));
  } catch (error: any) {
    console.error('Contact form error:', error);
    return addCorsHeaders(NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    ));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
