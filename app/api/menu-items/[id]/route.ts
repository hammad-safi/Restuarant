import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!item) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Menu item not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ 
      success: true, 
      data: {
        ...item,
        category_id: item.category?.id,
        category_name: item.category?.name,
        category_slug: item.category?.slug
      } 
    }));
  } catch (error: any) {
    console.error('Get menu item error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { id } = params;
    const data = await req.json();

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Menu item updated', data: updatedItem }));
  } catch (error: any) {
    console.error('Update menu item error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { id } = params;
    await prisma.menuItem.delete({ where: { id } });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Menu item deleted' }));
  } catch (error: any) {
    console.error('Delete menu item error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
