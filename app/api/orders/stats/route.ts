import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';

    const now = new Date();
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        created_at: { gte: startDate }
      }
    });

    const stats = {
      total_orders: orders.length,
      total_revenue: orders.reduce((sum, order) => sum + Number(order.total_amount), 0),
      pending_orders: orders.filter(o => o.status === 'pending').length,
      completed_orders: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length,
      cancelled_orders: orders.filter(o => o.status === 'cancelled').length
    };

    return addCorsHeaders(NextResponse.json({ success: true, data: stats }));
  } catch (error: any) {
    console.error('Get order stats error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
