import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import OrderClient from '@/components/OrderClient'

export const metadata = {
  title: 'Order Online | ZAIQA EXPRESS',
  description: 'Place your order online and get authentic Pakistani food delivered to your door',
}

export default function OrderPage() {
  return (
    <>
      <Header />
      <OrderClient />
      <MobileNav />
      <WhatsAppFAB />
      <Footer />
    </>
  )
}
