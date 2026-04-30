import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.setting.findMany();
    const formattedSettings = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return addCorsHeaders(NextResponse.json({ success: true, data: formattedSettings }));
  } catch (error: any) {
    console.error('Get settings error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const settings = await req.json();

    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Settings updated' }));
  } catch (error: any) {
    console.error('Update settings error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
