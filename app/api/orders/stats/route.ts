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

    const allOrders = await prisma.order.findMany();
    const rangeOrders = range === 'all' ? allOrders : allOrders.filter(o => new Date(o.created_at) >= startDate);

    const stats = {
      total_orders: rangeOrders.length,
      total_revenue: rangeOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
      lifetime_orders: allOrders.length,
      lifetime_revenue: allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
      pending: allOrders.filter(o => o.status === 'pending').length,
      confirmed: allOrders.filter(o => o.status === 'confirmed').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      out_for_delivery: allOrders.filter(o => o.status === 'out_for_delivery').length,
      completed: allOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length
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
