import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `#${timestamp.toString().slice(-4)}${random}`;
}

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
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (status) where.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.created_at = { gte: startOfDay, lte: endOfDay };
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    });

    return addCorsHeaders(NextResponse.json({ success: true, data: { orders, limit, offset } }));
  } catch (error: any) {
    console.error('Get orders error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customer_name, customer_phone, delivery_address, items, notes, estimated_delivery } = await req.json();

    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Customer name, phone and items are required' }, { status: 400 }));
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const subtotal = item.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        subtotal: subtotal,
        special_instructions: item.special_instructions
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        customer_name,
        customer_phone,
        delivery_address,
        total_amount: totalAmount,
        status: 'pending',
        notes,
        estimated_delivery: estimated_delivery ? new Date(estimated_delivery) : null,
        items: {
          create: orderItems
        }
      },
      include: { items: true }
    });

    // Auto-create an invoice for this online order
    const invoiceNumber = generateInvoiceNumber();
    await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        order_id: order.id,
        customer_name,
        customer_phone,
        order_type: 'online',
        table_number: 'Delivery',
        subtotal: totalAmount,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: totalAmount,
        payment_method: 'cash',
        payment_status: 'pending',
        cash_received: 0,
        change_returned: 0,
        items: {
          create: orderItems.map(item => ({
            item_name: item.item_name,
            item_price: item.item_price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            special_instructions: item.special_instructions
          }))
        }
      }
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        title: `New Order ${orderNumber}`,
        description: `${customer_name} placed an order for PKR ${totalAmount.toFixed(2)}`,
        type: 'order'
      }
    });

    return addCorsHeaders(NextResponse.json({ success: true, message: 'Order placed', data: order }, { status: 201 }));
  } catch (error: any) {
    console.error('Create order error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
