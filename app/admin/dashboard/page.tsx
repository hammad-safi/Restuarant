'use client';

import { useState, useEffect } from 'react';
import { getOrderStats, getOrders, getSettings } from '@/lib/api';
import Skeleton, { CardSkeleton, TableSkeleton } from '@/components/admin/Skeleton';

interface Stats {
  pending: number;
  confirmed: number;
  preparing: number;
  out_for_delivery: number;
  completed: number;
  total_orders: number;
  total_revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [businessName, setBusinessName] = useState('ZIQA EXPREES');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Load stats
        const statsResponse = await getOrderStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data as Stats);
        }

        // Load recent orders
        const ordersResponse = await getOrders({ limit: 5 });
        if (ordersResponse.success && ordersResponse.data) {
          setRecentOrders((ordersResponse.data as any).orders || []);
        }

        // Load settings
        const settingsResponse = await getSettings();
        if (settingsResponse.success && Array.isArray(settingsResponse.data)) {
          const nameSetting = settingsResponse.data.find((s: any) => s.key === 'restaurant_name');
          if (nameSetting) {
            setBusinessName(nameSetting.value);
          }
        }

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <>
      {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="font-headline-xl text-on-surface mb-2">Welcome back!</h2>
            <p className="text-on-surface-variant">
              Here&apos;s what&apos;s happening with {businessName} today.
            </p>
          </div>

          {isLoading ? (
            <AdminPageLoader />
          ) : (
            <>
              {/* Stats Grid */}
              {stats && (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: 'pending_actions', label: 'Pending Orders', value: stats.pending, color: 'yellow' },
                    { icon: 'check_circle', label: 'Confirmed', value: stats.confirmed, color: 'blue' },
                    { icon: 'local_fire_department', label: 'Being Prepared', value: stats.preparing, color: 'purple' },
                    { icon: 'payments', label: 'Today Revenue', value: `PKR ${stats.total_revenue.toLocaleString()}`, color: 'green' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl shadow-sm border ${
                        stat.color === 'yellow'
                          ? 'bg-yellow-50 border-yellow-200'
                          : stat.color === 'blue'
                          ? 'bg-blue-50 border-blue-200'
                          : stat.color === 'purple'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-green-50 border-green-200'
                      } transition-all`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-2 rounded-lg ${
                            stat.color === 'yellow'
                              ? 'bg-yellow-100'
                              : stat.color === 'blue'
                              ? 'bg-blue-100'
                              : stat.color === 'purple'
                              ? 'bg-purple-100'
                              : 'bg-green-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-primary">
                            {stat.icon}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 font-label-bold text-xs uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </div>
                  ))}
                </section>
              )}

              {/* Recent Orders Section */}
              <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-50">
                  <h2 className="font-headline-md text-slate-900">Recent Orders</h2>
                </div>
                {recentOrders.length === 0 ? (
                  <div className="px-6 py-8 text-center text-on-surface-variant">
                    No recent orders
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                          <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-widest">Customer</th>
                          <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-widest">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{order.order_number}</td>
                            <td className="px-6 py-4 text-slate-600">{order.customer_name}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              PKR {order.total_amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60"></span>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
    </>
  );
}
