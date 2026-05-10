import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' }
    });

    return addCorsHeaders(NextResponse.json({ success: true, data: messages }));
  } catch (error: any) {
    console.error('Get contact messages error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { id, is_read } = await req.json();
    if (!id) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Message ID is required' }, { status: 400 }));
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { is_read }
    });

    return addCorsHeaders(NextResponse.json({ success: true, data: updatedMessage }));
  } catch (error: any) {
    console.error('Update contact message error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Message ID is required' }, { status: 400 }));
    }

    await prisma.contactMessage.delete({
      where: { id }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Message deleted' }));
  } catch (error: any) {
    console.error('Delete contact message error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
