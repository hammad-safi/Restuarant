import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category) where.category = category;

    const items = await prisma.gallery.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    return addCorsHeaders(NextResponse.json({ success: true, data: items }));
  } catch (error: any) {
    console.error('Get gallery error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { image_url, category } = await req.json();

    if (!image_url) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 }));
    }

    const item = await prisma.gallery.create({
      data: {
        image_url,
        category: category || 'Food'
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Gallery item added', data: item }, { status: 201 }));
  } catch (error: any) {
    console.error('Create gallery item error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
