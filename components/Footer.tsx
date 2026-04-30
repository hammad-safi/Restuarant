import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 bg-[#f5f0e8] border-t-4 border-[#d4a843]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <h4 className="text-xl font-black text-[#d4a843] font-['Epilogue']">ZAIQA EXPRESS</h4>
          <p className="text-gray-600 dark:text-gray-400 font-body-md text-sm">
            Authentic Pakistani Flavors delivered to your doorstep. Experience the madness.
          </p>
        </div>

        <div>
          <h5 className="font-label-bold text-label-bold uppercase mb-4 text-on-surface">Explore</h5>
          <ul className="space-y-2">
            <li>
              <Link href="/menu" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Store Locator
              </Link>
            </li>
            <li>
              <Link href="/deals" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Deals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-bold text-label-bold uppercase mb-4 text-on-surface">Support</h5>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#d4a843] transition-colors">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-bold text-label-bold uppercase mb-4 text-on-surface">Find Us</h5>
          <div className="flex gap-4">
            <a href="#" className="text-[#d4a843] hover:text-[#d4a843]/80 transition-colors">
              <span className="material-symbols-outlined">social_leaderboard</span>
            </a>
            <a href="#" className="text-[#d4a843] hover:text-[#d4a843]/80 transition-colors">
              <span className="material-symbols-outlined">camera</span>
            </a>
            <a href="#" className="text-[#d4a843] hover:text-[#d4a843]/80 transition-colors">
              <span className="material-symbols-outlined">play_circle</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-8">
        <p className="font-['Epilogue'] text-sm">© 2024 Zaiqa Express. Authentic Pakistani Flavors.</p>
      </div>
    </footer>
  )
}
