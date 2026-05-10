'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.includes(path) || false;

  const navItems = [
    { icon: '⊞', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🛒', label: 'Orders', path: '/admin/orders' },
    { icon: '◈', label: 'Categories', path: '/admin/categories' },
    { icon: '🍴', label: 'Menu', path: '/admin/menu' },
    { icon: '🏷️', label: 'Deals', path: '/admin/deals' },
    { icon: '✉️', label: 'Messages', path: '/admin/messages' },
    { icon: '🖼', label: 'Gallery', path: '/admin/gallery' },
    { icon: '💳', label: 'Billing', path: '/admin/billing' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className={`fixed h-screen w-[210px] left-0 bg-[#1a1f2e] flex flex-col z-[200] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-[18px_20px_14px] border-b border-white/10">
        <h1 className="text-[15px] font-bold tracking-[3px] text-[#d4a843] uppercase">Ziqa Express</h1>
      </div>

      <div className="flex items-center gap-[10px] p-[14px_18px] border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center text-[13px] font-bold text-[#1a1f2e]">
          M
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white">Manager</p>
          <p className="text-[10px] text-white/40">Quiet Luxury Dining</p>
        </div>
      </div>

      <nav className="flex-1 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className={`flex items-center gap-[10px] p-[11px_20px] text-[13px] transition-all border-l-[3px] ${
              isActive(item.path)
                ? 'text-[#d4a843] bg-[#d4a843]/10 border-[#d4a843]'
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-[18px] text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
