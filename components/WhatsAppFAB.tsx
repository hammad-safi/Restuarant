'use client';

import { useEffect, useState } from 'react';

export default function WhatsAppFAB() {
  const [whatsappNumber, setWhatsappNumber] = useState('923456789000');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data.whatsapp) {
          setWhatsappNumber(data.data.whatsapp);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp setting:', error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Hello%20Zaiqa%20Express`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40 flex items-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group"
    >
      <span className="material-symbols-outlined fill-icon text-3xl">chat</span>
      <span className="font-label-bold whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-300 hidden md:inline">
        Chat with us
      </span>
    </a>
  )
}
