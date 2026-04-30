'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useEffect, useState } from 'react'

export default function MobileNav() {
  const pathname = usePathname()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-2 pb-safe bg-[#f5f0e8] border-t border-[#e2dbd0] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl">
      <Link
        href="/menu"
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
          isActive('/menu')
            ? 'text-[#d4a843] bg-[#d4a843]/10 rounded-xl px-3 py-1'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <span className="material-symbols-outlined">restaurant_menu</span>
        <span className="font-['Epilogue'] text-[10px] font-bold uppercase">Menu</span>
      </Link>

      <Link
        href="/deals"
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
          isActive('/deals')
            ? 'text-[#d4a843] bg-[#d4a843]/10 rounded-xl px-3 py-1'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50'
        }`}
      >
        <span className="material-symbols-outlined">local_offer</span>
        <span className="font-['Epilogue'] text-[10px] font-bold uppercase">Deals</span>
      </Link>

      <Link
        href="/order"
        className={`flex flex-col items-center justify-center transition-all active:scale-90 relative ${
          isActive('/order')
            ? 'text-[#d4a843] bg-[#d4a843]/10 rounded-xl px-3 py-1'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50'
        }`}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="font-['Epilogue'] text-[10px] font-bold uppercase">Cart</span>
        {mounted && getTotalItems() > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            {getTotalItems()}
          </span>
        )}
      </Link>

      <Link
        href="/contact"
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
          isActive('/contact')
            ? 'text-[#d4a843] bg-[#d4a843]/10 rounded-xl px-3 py-1'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50'
        }`}
      >
        <span className="material-symbols-outlined">chat</span>
        <span className="font-['Epilogue'] text-[10px] font-bold uppercase">WhatsApp</span>
      </Link>
    </nav>
  )
}
