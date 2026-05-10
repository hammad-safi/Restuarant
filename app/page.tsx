'use client';

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import { useCartStore } from '@/lib/store/cartStore'
import { useSettingsStore } from '@/lib/store/settingsStore'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getDeals } from '@/lib/api'

interface Deal {
  id: string;
  title: string;
  price?: number;
  discount_percentage?: number;
  discount_amount?: number;
  description: string;
  image_url: string;
}

export default function Home() {
  const addToCart = useCartStore((state) => state.addItem)
  const router = useRouter()
  const settings = useSettingsStore((state) => state.settings)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const result = await getDeals({ limit: settings.featured_items_count });
        if (result.success && result.data) {
          setDeals((result.data as any).items || []);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoadingDeals(false);
      }
    };
    fetchDeals();
  }, [settings.featured_items_count]);

  const handleAddToCart = (id: string, title: string, price: number | undefined) => {
    const finalPrice = price || 0;
    addToCart({ menu_item_id: id, name: title, price: finalPrice, quantity: 1 })
    alert(`${title} added to cart!`)
    router.push('/order')
  }

  return (
    <>
      <Header />
      <main className="pt-16 pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative h-[751px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
            src={settings.hero_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD42SHx-4xW7uD3Tk09L_y9-tPtjFoROj3zFr5yY6Xb0TH7f_EfLZCGZbE3FUXEXwjq_RoLwaOvWjDRIz-w9l3mO2PWYZVc9lY-fdAzKdBNKnLXS5dtDnc7vqL8edWwTUdSqSms2rxaxQFJhvIG2D7ohEFRrVlEerZ8OT-dvUvLcHqtgj7ArIQc4wU9G3b628dt3hYVPbnLfuYwyOlSKt49lBdM5rMcu3hmymBJyNEBm1S-dqpl-efdayrZwTyaE8nkogjEALoW0sPg"}
          />
          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-label-bold text-label-bold uppercase tracking-wider">
                Best in Town
              </span>
              <h2 className="font-display-xl text-display-xl text-white leading-none drop-shadow-lg">
                {settings.restaurant_name || 'Zaiqa Express'}: Taste the Madness
                <br />
                <span className="text-secondary-container">ذائقہ ایکسپریس</span>
              </h2>
              <p className="font-body-lg text-body-lg text-gray-100 max-w-xl">
                Experience the explosive flavors of authentic Pakistani street food fusion. We don&apos;t just cook; we create madness on a plate.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/order">
                  <button className="bg-primary text-white px-8 py-4 rounded-xl font-label-bold text-lg uppercase flex items-center gap-3 shadow-lg hover:shadow-primary/50 transition-all active:scale-95">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Order Now
                  </button>
                </Link>
                <Link href="/menu">
                  <button className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-xl font-label-bold text-lg uppercase hover:bg-white hover:text-primary transition-all active:scale-95">
                    View Menu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="font-display-lg text-display-lg text-primary uppercase">Mouth-Watering Deals</h3>
              <p className="text-tertiary font-body-md">Hand-picked value combos just for you</p>
            </div>
            <Link href="/deals">
              <button className="text-primary font-label-bold flex items-center gap-2 hover:underline">
                See All Deals <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div key={deal.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={deal.image_url}
                  />
                  <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container font-headline-md px-4 py-1 rounded-xl shadow-md z-20">
                    Rs. {deal.discount_amount || deal.price}
                  </div>
                  {deal.discount_percentage && (
                    <div className="absolute top-4 left-4 bg-error text-white font-label-bold px-3 py-1 rounded-lg shadow-md z-20">
                      {deal.discount_percentage}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-headline-md text-headline-md mb-2">{deal.title}</h4>
                  <p className="text-tertiary text-sm mb-4">{deal.description}</p>
                  <button 
                    onClick={() => handleAddToCart(deal.id, deal.title, deal.discount_amount || deal.price)}
                    className="w-full py-3 border-2 border-primary text-primary font-label-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
            {loadingDeals && Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-96 rounded-3xl"></div>
            ))}
            {!loadingDeals && deals.length === 0 && (
              <p className="col-span-full text-center text-slate-400 py-12">No featured deals available at the moment.</p>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-primary py-20 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container rounded-full blur-3xl opacity-30"></div>
              <h3 className="font-display-lg text-display-lg mb-6">Authentic Pakistani Soul, Modern Taste.</h3>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                We source every spice from the heart of Lahore and Karachi to bring you that unmistakable home-grown taste, delivered at lightning speed.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-container fill-icon">check_circle</span>
                  <span className="font-label-bold">100% Halal Certified Ingredients</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-container fill-icon">check_circle</span>
                  <span className="font-label-bold">Freshly Prepared Every Single Day</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-container fill-icon">check_circle</span>
                  <span className="font-label-bold">30-Minute Delivery Guarantee</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                alt="Pizza Slice"
                className="rounded-2xl h-64 w-full object-cover shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsciHTicjCK3BhXzjje74nfH6LgyfJzyPWOQs-HofPEjXEZNA_0r7nVq4dM299P5-UeM9SiZ7lTJnI7ymZ01BZJQBMbGjQRe8xXlHW5sM15QtzWFnqm13gC7a12NlSbaRZgftRgMa9tiUfZnM1ZRj1tHaUrtBFsfBvWmMcmWOwjXYgZ26IotFgHnCz8s4PlC4ToVXlg0hTPIl6v1rStelFVGMSlBbmo5YsKY9uz7fW1KiUOT4P5ZJoMyol9Ai-77-J5Pwz8qQHUUgg"
              />
              <img
                alt="Hot Wings"
                className="rounded-2xl h-64 w-full object-cover mt-8 shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwM4wDrWsJBgyLhcuHugPL5Uubr11UglOyX7XAYRw3DAngN_JRsLppEMDqSOn6t27ZlDcnYjo08prmxJADPTZR39eZHXL7J3qeJ5pkv5cf-MIUozmx5Yr1frjqYXCRMhOijVeAb--1nTUdU2Nf3n52VcuXHDM66-ofQIuzjOUgyxhPRihMLej7-uXXqevC2Qf3LzM9nr_eIr8V5WAg7NnKNQ2XQUes-tjgV5rzXU-S6_cJ7C0Bze6R01KlKwLyr-Ymf6OaISs-JoB8"
              />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-headline-md text-headline-md mb-4 uppercase">Join the Zaiqa Gang</h3>
            <p className="text-tertiary mb-8">Get exclusive deals, birthday treats, and first access to our new menu items straight in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 bg-surface-container border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary"
                placeholder="Your Email Address"
                type="email"
              />
              <button className="bg-primary text-white font-label-bold px-10 py-4 rounded-xl hover:bg-primary-container transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <MobileNav />
      <WhatsAppFAB />
      <Footer />
    </>
  )
}
