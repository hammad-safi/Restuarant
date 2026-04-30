import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

function generateInvoiceNumber() {
  const prefix = 'ZIQA';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const payment_status = searchParams.get('payment_status');

    const where: any = {};
    if (payment_status) where.payment_status = payment_status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { items: true },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    });

    return addCorsHeaders(NextResponse.json({ success: true, data: { invoices, limit, offset } }));
  } catch (error: any) {
    console.error('Get invoices error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!isAdmin(user)) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const { 
      order_id, customer_name, customer_phone, order_type, table_number,
      items, subtotal, tax_amount = 0, discount_amount = 0,
      payment_method, cash_received = 0
    } = await req.json();

    if (!customer_name || !items || items.length === 0) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Customer name and items are required' }, { status: 400 }));
    }

    const total_amount = subtotal + tax_amount - discount_amount;
    const change_returned = cash_received - total_amount;
    const invoice_number = generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoice_number,
        order_id,
        customer_name,
        customer_phone,
        order_type: order_type || 'dine-in',
        table_number,
        subtotal,
        tax_amount,
        discount_amount,
        total_amount,
        payment_method: payment_method || 'cash',
        payment_status: cash_received > 0 ? 'paid' : 'pending',
        cash_received,
        change_returned: change_returned > 0 ? change_returned : 0,
        items: {
          create: items.map((item: any) => ({
            item_name: item.name,
            item_price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            special_instructions: item.special_instructions
          }))
        }
      },
      include: { items: true }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Invoice created', data: invoice }, { status: 201 }));
  } catch (error: any) {
    console.error('Create invoice error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
