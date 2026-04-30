import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { id } = params;
    const { status, estimated_delivery } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        estimated_delivery: estimated_delivery ? new Date(estimated_delivery) : undefined
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Order status updated', data: updatedOrder }));
  } catch (error: any) {
    console.error('Update order status error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
