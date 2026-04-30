import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Format message for WhatsApp
    let message = `*🧾 ZIQA EXPRESS Invoice*\n\n`;
    message += `*Invoice #: ${invoice.invoice_number}*\n`;
    message += `*Date:* ${new Date(invoice.invoice_date).toLocaleDateString()}\n\n`;
    message += `*Customer:* ${invoice.customer_name}\n`;
    if (invoice.table_number) message += `*Table:* ${invoice.table_number}\n`;
    message += `\n`;
    
    message += `*Items:*\n`;
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item: any) => {
        message += `• ${item.quantity}x ${item.item_name} - PKR ${item.subtotal}\n`;
      });
    }
    
    message += `\n`;
    message += `*Subtotal:* PKR ${invoice.subtotal}\n`;
    if (Number(invoice.tax_amount) > 0) message += `*Tax:* PKR ${invoice.tax_amount}\n`;
    if (Number(invoice.discount_amount) > 0) message += `*Discount:* PKR ${invoice.discount_amount}\n`;
    message += `*TOTAL:* PKR ${invoice.total_amount}\n\n`;
    message += `*Payment:* ${invoice.payment_method}\n`;
    message += `*Status:* ${invoice.payment_status}\n\n`;
    message += `_Thank you for dining with us!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${invoice.customer_phone}?text=${encodedMessage}`;

    return addCorsHeaders(NextResponse.json({ success: true, data: { whatsapp_url: whatsappUrl, message: message } }));
  } catch (error: any) {
    console.error('Send WhatsApp error:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
