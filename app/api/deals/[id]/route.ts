import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: { menu_items: true }
    });

    if (!deal) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ success: true, data: deal }));
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const body = await req.json();
    const { title, description, discount_percentage, discount_amount, image_url, is_active, start_date, end_date, menu_item_ids } = body;

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        discount_percentage: discount_percentage ? parseFloat(discount_percentage) : null,
        discount_amount: discount_amount ? parseFloat(discount_amount) : null,
        image_url: image_url || null,
        is_active: is_active !== false,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        menu_items: {
          set: [], // Clear existing relations
          connect: menu_item_ids ? menu_item_ids.map((id: string) => ({ id })) : []
        }
      },
      include: {
        menu_items: true
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Deal updated', data: deal }));
  } catch (error: any) {
    console.error('Update deal error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    await prisma.deal.delete({
      where: { id: params.id }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Deal deleted' }));
  } catch (error: any) {
    console.error('Delete deal error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
