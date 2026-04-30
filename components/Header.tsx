'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 w-full z-50 bg-[#1a1f2e] border-b border-white/10 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-[70px]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-white/70 cursor-pointer hover:text-white transition-colors">menu</span>
          <Link href="/">
            <h1 className="text-[18px] md:text-[22px] font-bold tracking-[3px] text-[#d4a843] uppercase">
              ZIQA EXPREES
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className={`text-[13px] uppercase tracking-wider transition-all py-1 border-b-2 ${isActive('/')
                ? 'text-[#d4a843] border-[#d4a843]'
                : 'text-white/50 border-transparent hover:text-white'
              }`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`text-[13px] uppercase tracking-wider transition-all py-1 border-b-2 ${isActive('/menu')
                ? 'text-[#d4a843] border-[#d4a843]'
                : 'text-white/50 border-transparent hover:text-white'
              }`}
          >
            Menu
          </Link>
          <Link
            href="/deals"
            className={`text-[13px] uppercase tracking-wider transition-all py-1 border-b-2 ${isActive('/deals')
                ? 'text-[#d4a843] border-[#d4a843]'
                : 'text-white/50 border-transparent hover:text-white'
              }`}
          >
            Deals
          </Link>
          <Link
            href="/contact"
            className={`text-[13px] uppercase tracking-wider transition-all py-1 border-b-2 ${isActive('/contact')
                ? 'text-[#d4a843] border-[#d4a843]'
                : 'text-white/50 border-transparent hover:text-white'
              }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/order" className="relative group flex items-center justify-center p-2">
            <span className="material-symbols-outlined text-[#d4a843] text-2xl group-hover:scale-110 transition-transform">
              shopping_cart
            </span>
            {mounted && getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1a1f2e]">
                {getTotalItems()}
              </span>
            )}
          </Link>
          <Link href="/order">
            <button className="bg-[#d4a843] hover:brightness-110 text-[#1a1f2e] px-6 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all active:scale-95">
              Order Now
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
