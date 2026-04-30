import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const item = await prisma.category.findUnique({ where: { id } });

    if (!item) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ success: true, data: item }));
  } catch (error: any) {
    console.error('Get category error:', error);
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

    const updatedItem = await prisma.category.update({
      where: { id },
      data
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Category updated', data: updatedItem }));
  } catch (error: any) {
    console.error('Update category error:', error);
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
    await prisma.category.delete({ where: { id } });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Category deleted' }));
  } catch (error: any) {
    console.error('Delete category error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
