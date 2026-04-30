import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { id } = params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!invoice) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ success: true, data: invoice }));
  } catch (error: any) {
    console.error('Get invoice error:', error);
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
    const { payment_status, payment_method, cash_received } = await req.json();

    const currentInvoice = await prisma.invoice.findUnique({ where: { id } });
    if (!currentInvoice) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 }));
    }

    let change_returned = Number(currentInvoice.change_returned);
    if (cash_received) {
      change_returned = Number(cash_received) - Number(currentInvoice.total_amount);
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        payment_status: payment_status || currentInvoice.payment_status,
        payment_method: payment_method || currentInvoice.payment_method,
        cash_received: cash_received || currentInvoice.cash_received,
        change_returned: change_returned > 0 ? change_returned : 0
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Invoice updated', data: updatedInvoice }));
  } catch (error: any) {
    console.error('Update invoice error:', error);
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
    await prisma.invoice.delete({ where: { id } });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Invoice deleted' }));
  } catch (error: any) {
    console.error('Delete invoice error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
