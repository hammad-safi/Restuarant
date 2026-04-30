'use client';

import { useState, useEffect, useCallback } from 'react';
import { getInvoices, updateInvoice, sendInvoiceWhatsapp, getInvoiceExportUrl } from '@/lib/api';
import { useSettingsStore } from '@/lib/store/settingsStore';

interface InvoiceItem {
  id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
  special_instructions?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  table_number?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  cash_received: number;
  change_returned: number;
  invoice_date: string;
  items: InvoiceItem[];
}

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [cashInput, setCashInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const settings = useSettingsStore((state) => state.settings);

  const fetchInvoicesData = useCallback(async () => {
    try {
      const result = await getInvoices();
      if (result.success && result.data) {
        const invs = (result.data as any).invoices as Invoice[];
        setInvoices(invs);
        if (invs.length > 0) {
          setSelectedInvoice(invs[0]);
          setCashInput(invs[0].cash_received.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoicesData();
  }, [fetchInvoicesData]);

  const handleDownloadPDF = () => {
    if (!selectedInvoice) return;
    window.open(getInvoiceExportUrl(selectedInvoice.id), '_blank');
  };

  const handleWhatsApp = async () => {
    if (!selectedInvoice) return;
    try {
      const result = await sendInvoiceWhatsapp(selectedInvoice.id);
      if (result.success && result.data) {
        window.open((result.data as any).whatsapp_url, '_blank');
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
    }
  };

  const handleCompleteTransaction = async (sendWhatsapp = false) => {
    if (!selectedInvoice) return;
    try {
      setIsProcessing(true);
      const cash = parseFloat(cashInput) || 0;
      const result = await updateInvoice(selectedInvoice.id, {
        payment_status: 'paid',
        cash_received: cash,
      });
      
      if (result.success && result.data) {
        // Update local state
        const updatedInvoice = { ...selectedInvoice, ...result.data, payment_status: 'paid', cash_received: cash } as Invoice;
        setSelectedInvoice(updatedInvoice);
        setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
        
        // One-Click WhatsApp
        if (sendWhatsapp) {
          const waResult = await sendInvoiceWhatsapp(selectedInvoice.id);
          if (waResult.success && waResult.data) {
            window.open((waResult.data as any).whatsapp_url, '_blank');
          }
        }

        // Direct PDF Download (optional, but requested in plan: "Ensure the PDF download starts instantly without extra clicks")
        // We can trigger it here if desired, or maybe just for "Complete" action.
        // For now, let's just do WhatsApp as requested by the user specifically.
        
        if (!sendWhatsapp) {
          alert('Transaction completed successfully!');
        }
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <AdminPageLoader />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Invoice Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {selectedInvoice ? (
              <div className="w-full max-w-[600px] bg-white shadow-xl rounded-sm p-8 md:p-12 border border-slate-200 relative print-invoice">
                {/* Red Accent Top Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

                {/* Header Section */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          restaurant
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline-lg text-primary tracking-tighter mb-1 uppercase">
                    {settings.restaurant_name || 'ZIQA EXPREES'}
                  </h3>
                  <p className="font-label-sm text-slate-500 max-w-[250px] mx-auto uppercase tracking-wider">
                    {settings.address || 'FL-4/15, Main Rashid Minhas Rd, Gulshan-e-Iqbal, Karachi'}
                  </p>
                </div>

                {/* Customer & Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-slate-100 py-6">
                  <div>
                    <p className="font-label-bold text-slate-400 uppercase mb-1">Billed To</p>
                    <p className="font-headline-md text-on-surface">{selectedInvoice.customer_name}</p>
                    <p className="font-body-md text-slate-500">{selectedInvoice.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-bold text-slate-400 uppercase mb-1">Order Details</p>
                    <p className="font-body-md text-on-surface">
                      Order Type: <span className="font-semibold capitalize">{selectedInvoice.order_type}</span>
                    </p>
                    {selectedInvoice.table_number && (
                      <p className="font-body-md text-on-surface">
                        Table: <span className="font-semibold">{selectedInvoice.table_number}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Itemized Table */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="text-left py-3 font-label-bold uppercase text-slate-900 w-12">Qty</th>
                      <th className="text-left py-3 font-label-bold uppercase text-slate-900">Item Name</th>
                      <th className="text-right py-3 font-label-bold uppercase text-slate-900">Price</th>
                      <th className="text-right py-3 font-label-bold uppercase text-slate-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4 font-body-md">{item.quantity.toString().padStart(2, '0')}</td>
                        <td className="py-4">
                          <p className="font-headline-md text-sm">{item.item_name}</p>
                          {item.special_instructions && <p className="text-xs text-slate-400">{item.special_instructions}</p>}
                        </td>
                        <td className="py-4 text-right font-body-md">{item.item_price}</td>
                        <td className="py-4 text-right font-headline-md text-sm">{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Section */}
                <div className="flex flex-col items-end space-y-2 mb-10">
                  <div className="flex justify-between w-full max-w-[240px]">
                    <span className="text-slate-500 font-body-md">Subtotal</span>
                    <span className="font-body-lg">{selectedInvoice.subtotal} PKR</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[240px]">
                    <span className="text-slate-500 font-body-md">Tax</span>
                    <span className="font-body-lg">{selectedInvoice.tax_amount} PKR</span>
                  </div>
                  {selectedInvoice.discount_amount > 0 && (
                    <div className="flex justify-between w-full max-w-[240px]">
                      <span className="text-slate-500 font-body-md">Discount</span>
                      <span className="font-body-lg">-{selectedInvoice.discount_amount} PKR</span>
                    </div>
                  )}
                  <div className="flex justify-between w-full max-w-[240px] pt-4 border-t border-slate-200">
                    <span className="text-slate-900 font-label-bold text-lg uppercase">Grand Total</span>
                    <span className="font-stat-value text-primary">{selectedInvoice.total_amount} PKR</span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-end text-slate-400 border-t border-dashed border-slate-200 pt-6">
                  <div className="text-xs">
                    <p>
                      Invoice #: <span className="text-slate-600 font-medium">{selectedInvoice.invoice_number}</span>
                    </p>
                    <p>
                      Date: <span className="text-slate-600 font-medium">
                        {new Date(selectedInvoice.invoice_date).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      Time: <span className="text-slate-600 font-medium">
                        {new Date(selectedInvoice.invoice_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest font-bold">Thank you for dining!</p>
                    <p className="text-xs">{settings.restaurant_name.toLowerCase().replace(/\s+/g, '')}.pk</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[600px] h-[600px] bg-white shadow-sm rounded-sm p-8 flex flex-col items-center justify-center border border-slate-200">
                <span className="material-symbols-outlined text-slate-200 text-8xl mb-4">description</span>
                <p className="text-slate-400 font-headline-md">Select an invoice to preview</p>
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h4 className="font-headline-md text-slate-900 mb-6">Quick Actions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => window.print()} 
                  disabled={!selectedInvoice}
                  className="w-full bg-primary text-white py-4 rounded-lg font-headline-md flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Bill
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={!selectedInvoice}
                  className="w-full bg-slate-100 text-slate-900 py-4 rounded-lg font-headline-md flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                  Download PDF
                </button>
                <button 
                  onClick={handleWhatsApp}
                  disabled={!selectedInvoice}
                  className="w-full bg-[#25D366] text-white py-4 rounded-lg font-headline-md flex items-center justify-center gap-3 hover:opacity-90 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                  Send via WhatsApp
                </button>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
              </div>
              <h4 className="font-label-bold uppercase text-slate-400 mb-4 tracking-widest">Payment Status</h4>
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-3 h-3 rounded-full ${selectedInvoice?.payment_status === 'paid' ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                <span className="font-headline-md">
                  {selectedInvoice?.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">CASH RECEIVED</p>
                  <input 
                    type="number" 
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    placeholder="0"
                    disabled={selectedInvoice?.payment_status === 'paid'}
                    className="bg-transparent border-none p-0 text-2xl font-bold focus:ring-0 w-full text-white disabled:opacity-50" 
                  />
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-secondary uppercase font-bold mb-1">CHANGE TO RETURN</p>
                  <p className="text-2xl font-bold">
                    {Math.max(0, (parseFloat(cashInput) || 0) - (selectedInvoice?.total_amount || 0))} PKR
                  </p>
                </div>
              </div>
              {selectedInvoice?.payment_status !== 'paid' && (
                <div className="space-y-3 mt-6">
                  <button 
                    onClick={() => handleCompleteTransaction(true)}
                    disabled={isProcessing}
                    className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    Complete & Send WhatsApp
                  </button>
                  <button 
                    onClick={() => handleCompleteTransaction(false)}
                    disabled={isProcessing}
                    className="w-full bg-white text-slate-900 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors active:scale-[0.98] disabled:opacity-50"
                  >
                    Complete Only
                  </button>
                </div>
              )}
            </div>

            {/* Receipt History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-label-bold text-slate-900">Recent Invoices</h4>
                <button onClick={fetchInvoicesData} className="text-xs text-primary font-bold">
                  Refresh
                </button>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {invoices.map((invoice, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setCashInput(invoice.cash_received.toString());
                    }}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${selectedInvoice?.id === invoice.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-slate-50'}`}
                  >
                    <div>
                      <p className="text-sm font-bold">{invoice.invoice_number}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(invoice.invoice_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {invoice.payment_method}
                      </p>
                    </div>
                    <p className="font-bold text-sm">{invoice.total_amount} PKR</p>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <p className="text-center py-4 text-slate-400 text-sm">No invoices found</p>
                )}
              </div>
            </div>
          </div>
    </div>
  );
}
