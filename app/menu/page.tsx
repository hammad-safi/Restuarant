import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import MenuClient from '@/components/MenuClient'

export const metadata = {
  title: 'Menu | ZAIQA EXPRESS',
  description: 'Browse our full menu of authentic Pakistani food with prices in PKR',
}

export default function MenuPage() {
  return (
    <>
      <Header />
      <MenuClient />
      <Footer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  )
}
