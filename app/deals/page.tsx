import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import DealsClient from '@/components/DealsClient'

export const metadata = {
  title: 'Promotions & Deals | ZAIQA EXPRESS',
  description: 'Check out our exclusive deals and promotions on authentic Pakistani fast food',
}

export default function DealsPage() {
  return (
    <>
      <Header />
      <DealsClient />
      <Footer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  )
}
