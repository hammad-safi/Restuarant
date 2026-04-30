import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (active !== null) {
      where.is_active = active === 'true';
    }

    const items = await prisma.deal.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    });

    return addCorsHeaders(NextResponse.json({ success: true, data: { items, limit, offset } }));
  } catch (error: any) {
    console.error('Get deals error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { title, description, discount_percentage, discount_amount, image_url, is_active, start_date, end_date } = await req.json();

    if (!title) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 }));
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description: description || null,
        discount_percentage: discount_percentage ? parseFloat(discount_percentage) : null,
        discount_amount: discount_amount ? parseFloat(discount_amount) : null,
        image_url: image_url || null,
        is_active: is_active !== false,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: `New Deal: ${title}`,
        description: `A new deal "${title}" has been created and is now live.`,
        type: 'deal'
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Deal created', data: deal }, { status: 201 }));
  } catch (error: any) {
    console.error('Create deal error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
