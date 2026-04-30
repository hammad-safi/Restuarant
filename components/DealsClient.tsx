'use client';

import { getDeals } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  image_url: string;
  is_active: boolean;
}

export default function DealsClient() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);

  const { data: dealsResponse, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals({ limit: 20 }),
  });

  const deals = (dealsResponse?.data as any)?.deals || (dealsResponse?.data as any)?.items || [];

  const handleClaimDeal = (deal: Deal | null) => {
    if (!deal) return;
    addToCart({
      menu_item_id: `deal-${deal.id}`,
      name: deal.title,
      price: deal.discount_amount || 1500, // Fallback price
      quantity: 1,
    });
    alert(`${deal.title} added to cart!`);
    router.push('/order');
  };

  return (
    <main className="pt-24 pb-32">
      {/* Hero Promotion Section */}
      <section className="px-6 mb-12 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-primary-container min-h-[400px] flex items-center p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoDPqV0cH_GcWpIOOdWgPIw7PIgTpz_Drgrjdv_wr_AIy4AwWZzfWug4jt3jgsmr_AxdGpzJaLk-EMkLaxYAoOolc8_-ngE56dq7c8HVQXBEBWtjWWovj8_fJrW1qu2J3RV7llBTfkySWo66N2g-qAnEE8-4msnpfYku57iqrGb_BNyTV0gHsM3_w1KlsuUnpFdD-80pKbmUo8XUDf6hBjAvUlPoa3uMbKPZKdGTb3YicwapdomWmQ5vBE52Lybpr1QARNKOL82EtO"
              alt="Burgers"
            />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-block bg-secondary-container text-on-secondary-fixed px-4 py-1 rounded-full font-label-bold text-label-bold mb-6">
              LIMITED TIME FLASH DEAL
            </div>
            <h2 className="font-display-xl text-display-xl text-white mb-4">THE SPICY REVOLUTION IS HERE</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-8">
              Get any Signature Burger and Loaded Fries at half price. Taste the authentic spice of Lahore delivered to your door.
            </p>

            {/* Countdown Timer */}
            <div className="flex gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[80px] text-center border border-white/20">
                <div className="text-3xl font-black text-white">02</div>
                <div className="text-xs text-white/70 font-bold">HOURS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[80px] text-center border border-white/20">
                <div className="text-3xl font-black text-white">45</div>
                <div className="text-xs text-white/70 font-bold">MINS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[80px] text-center border border-white/20">
                <div className="text-3xl font-black text-white">12</div>
                <div className="text-xs text-white/70 font-bold">SECS</div>
              </div>
            </div>

            <button 
              onClick={() => handleClaimDeal(deals[0] || null)}
              className="bg-white text-primary px-8 py-4 rounded-xl font-label-bold text-lg active:scale-95 transition-all shadow-lg hover:brightness-95"
            >
              CLAIM 50% OFF NOW
            </button>
          </div>
        </div>
      </section>

      {/* Promotion Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-background">Exclusive Offers</h3>
            <p className="text-tertiary">Our hottest deals, tailored for your appetite.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">
              refresh
            </span>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant font-body-lg">No deals available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deals.map((deal, index) => (
              <div
                key={deal.id}
                className={`group relative overflow-hidden rounded-3xl ${
                  index === 0
                    ? 'md:col-span-2 bg-surface-container-high h-[450px]'
                    : 'bg-secondary-container h-[300px]'
                }`}
              >
                <img
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                    index === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                  src={deal.image_url}
                  alt={deal.title}
                />
                <div className={`absolute inset-0 ${index === 0 ? 'bg-gradient-to-t from-black/80 via-transparent to-transparent' : ''}`}></div>
                
                {index === 0 && (
                  <div className="absolute top-6 left-6 bg-[#d4a843] text-[#1a1f2e] font-black px-4 py-2 rounded-lg text-xl shadow-xl">
                    {deal.discount_percentage ? `${deal.discount_percentage}% OFF` : 'SPECIAL OFFER'}
                  </div>
                )}

                <div className={`absolute ${index === 0 ? 'bottom-8 left-8 right-8' : 'top-8 left-8 right-8'}`}>
                  <h4 className={`font-black text-white mb-2 ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                    {deal.title}
                  </h4>
                  <p className={`text-white/80 font-body-md ${index === 0 ? '' : 'text-sm'}`}>{deal.description}</p>
                  {index === 0 && (
                    <button 
                      onClick={() => handleClaimDeal(deal)}
                      className="bg-secondary-container text-on-secondary-fixed px-6 py-3 rounded-xl font-label-bold mt-4"
                    >
                      REDEEM OFFER
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}