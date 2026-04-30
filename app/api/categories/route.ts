import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const items = await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' }
    });
    return addCorsHeaders(NextResponse.json({ success: true, data: { items } }));
  } catch (error: any) {
    console.error('Get categories error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { name, slug, description, image_url, display_order, is_active } = await req.json();

    if (!name || !slug) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Name and slug are required' }, { status: 400 }));
    }

    const item = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image_url: image_url || null,
        display_order: display_order || 0,
        is_active: is_active !== false
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Category created', data: item }, { status: 201 }));
  } catch (error: any) {
    console.error('Create category error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
