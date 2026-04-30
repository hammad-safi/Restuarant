'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMenuItems, getCategories, createOrder } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store/cartStore';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_name: string;
  is_hot: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function OrderClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const addToCartStore = useCartStore((state) => state.addItem);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const calculateTotal = useCartStore((state) => state.getTotalPrice);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cart = mounted ? cartItems : [];

  const addToCart = (item: MenuItem) => {
    addToCartStore({
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesResponse, isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const { data: menuItemsResponse, isLoading: isLoadingItems } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: () => getMenuItems({ category: selectedCategory === 'all' ? undefined : selectedCategory, limit: 50 }),
  });

  const categories = (categoriesResponse?.data as any)?.categories || [];
  const menuItems = (menuItemsResponse?.data as any)?.items || [];
  const isLoading = isLoadingCats || isLoadingItems;

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, delivery_address: data.display_name }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Could not fetch address from location.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        alert('Unable to retrieve your location');
      }
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_phone || !formData.delivery_address) {
      alert('Please fill in all required fields');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to your cart');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        delivery_address: formData.delivery_address,
        items: cart,
        notes: formData.notes,
        estimated_delivery: new Date(Date.now() + 30 * 60000).toISOString(),
      });

      if (response.success) {
        alert(`Order placed successfully! Order #${(response.data as any)?.order_number}`);
        setFormData({
          customer_name: '',
          customer_phone: '',
          delivery_address: '',
          notes: '',
        });
        clearCart();
        setShowCart(false);
      } else {
        alert('Error placing order: ' + response.message);
      }
    } catch (err) {
      alert('Error placing order');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal();

  return (
    <main className="pt-24 pb-32 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">Taste the Tradition</h2>
        <p className="font-body-lg text-body-lg text-tertiary">
          Order authentic Pakistani food delivered to your door.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          {/* Category Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                refresh
              </span>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.category_name}</p>
                    </div>
                    {item.is_hot && (
                      <span className="bg-[#d4a843] text-[#1a1f2e] px-2 py-1 rounded text-xs font-bold">
                        🔥 Hot
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      PKR {item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-primary text-on-primary px-3 py-1 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 sticky top-24 p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              Your Cart
              <span className="bg-primary text-on-primary px-2 py-1 rounded text-xs">
                {cart.length}
              </span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  shopping_cart
                </span>
                <p className="text-slate-500 text-sm mt-2">Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.menu_item_id} className="flex justify-between items-center pb-3 border-b">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          PKR {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                          className="w-6 h-6 bg-slate-200 rounded text-xs font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                          className="w-6 h-6 bg-slate-200 rounded text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.menu_item_id)}
                          className="text-[#d4a843] hover:bg-[#d4a843]/10 p-1 rounded"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCart(true)}
                  className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold hover:brightness-110 transition-all"
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">Checkout</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ahmed Khan"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="03001234567"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-bold text-slate-700">
                    Delivery Address *
                  </label>
                  <button 
                    type="button" 
                    onClick={getLocation}
                    disabled={isLocating}
                    className="text-xs text-[#d4a843] flex items-center gap-1 hover:brightness-110"
                  >
                    <span className="material-symbols-outlined text-[14px]">my_location</span>
                    {isLocating ? 'Locating...' : 'Use My Location'}
                  </button>
                </div>
                <textarea
                  required
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full street address, building, apartment"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Extra spicy, no onions, etc."
                  rows={2}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <h4 className="font-bold">Order Summary</h4>
                {cart.map((item) => (
                  <div key={item.menu_item_id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span className="text-primary">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}