import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { is_available: true };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    const formattedItems = items.map(item => ({
      ...item,
      category_id: item.category?.id,
      category_name: item.category?.name,
      category_slug: item.category?.slug
    }));

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        limit,
        offset
      }
    }));
  } catch (error: any) {
    console.error('Get menu items error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { name, description, price, image_url, category_id, is_hot, is_deal, is_available, preparation_time } = await req.json();

    if (!name || !price) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Name and price are required' }, { status: 400 }));
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        image_url: image_url || null,
        category_id: category_id || null,
        is_hot: is_hot || false,
        is_deal: is_deal || false,
        is_available: is_available !== false,
        preparation_time: preparation_time || 15
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Menu item created', data: item }, { status: 201 }));
  } catch (error: any) {
    console.error('Create menu item error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
