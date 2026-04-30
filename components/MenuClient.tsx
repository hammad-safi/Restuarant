'use client';

import { useState } from 'react';
import { getMenuItems, getCategories } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store/cartStore';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_hot: boolean;
  is_deal: boolean;
  category_name: string;
  category_slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function MenuClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('burgers');
  const addToCart = useCartStore((state) => state.addItem);

  const { data: categoriesResponse, isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const { data: menuResponse, isLoading: isLoadingMenu, error: menuError } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: () => getMenuItems({ category: selectedCategory, limit: 50 }),
  });

  const categories = (categoriesResponse?.data as any)?.items || (categoriesResponse?.data as any)?.categories || [];
  const menuItems = (menuResponse?.data as any)?.items || [];
  const isLoading = isLoadingCats || isLoadingMenu;
  const error = menuError ? 'An error occurred while loading the menu' : '';

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    alert(`${item.name} added to cart!`);
  };

  return (
    <main className="pt-24 pb-32">
      {/* Hero Section */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-[300px] md:h-[400px]">
          <img
            alt="Gourmet Pakistani Fusion Burger"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5dViHufLcwx6iDoOp4ACmp2Ew0IGtEnwkFqhCtyj9U-7_oAZsIKNLTmzywoj6VvCEeFRKPn-9R6J5MKzV2sBmXaUJZoIdIdqush6KEA-_wO0_AK_jeIl5zSORldRFCMK9-i0ynWnGU2BqJ4rmNPM1hdsnCjsmon716x0SKNlCM4nR77KaNQvKMc0Zs2unfcK_47gjsca1IayfxhBehLXj5VEIKCsxnAOszEvaCoYxJA2ezq2zEjiOckoyU46kwgOR1t9VggGR5f1s"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-bold font-label-bold mb-4 w-fit">
              Seasonal Special
            </span>
            <h2 className="font-display-xl text-display-xl text-white mb-2">Taste the Spice of Karachi</h2>
            <p className="text-white/80 font-body-lg text-body-lg max-w-2xl">
              Authentic Pakistani street flavors reimagined. Fast, fresh, and firing up your palate.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-sm px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-label-bold text-label-bold transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-white border border-gray-100 text-tertiary hover:border-primary-container'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Items Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">
              refresh
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 font-body-lg">{error}</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant font-body-lg">No items found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="relative h-[250px] overflow-hidden bg-gray-100">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={item.image_url}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {item.is_hot && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">local_fire_department</span>
                        HOT
                      </span>
                    )}
                    {item.is_deal && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        DEAL
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-headline-md text-on-surface font-bold">{item.name}</h3>
                    <span className="text-primary font-headline-md font-bold whitespace-nowrap">
                      PKR {item.price}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm line-clamp-3 mb-4">{item.description}</p>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}