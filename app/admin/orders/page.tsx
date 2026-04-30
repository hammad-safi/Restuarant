'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderStats, updateOrderStatus } from '@/lib/api';
import { CardSkeleton, TableSkeleton } from '@/components/admin/Skeleton';

interface OrderItem {
  id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  created_at: string;
}

interface Stats {
  pending: number;
  confirmed: number;
  preparing: number;
  out_for_delivery: number;
  completed: number;
  total_orders: number;
  total_revenue: number;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: stats = null, isLoading: isLoadingStats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const res = await getOrderStats();
      return res.success ? (res.data as Stats) : null;
    },
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: async () => {
      const res = await getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 50,
      });
      return res.success ? (((res.data as any)?.orders as Order[]) || []) : [];
    },
  });

  const isLoading = isLoadingStats || isLoadingOrders;

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
      updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await statusMutation.mutateAsync({ orderId, newStatus });
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          stats &&
          [
            { label: 'Pending', value: stats.pending, color: 'yellow' },
            { label: 'Confirmed', value: stats.confirmed, color: 'blue' },
            { label: 'Today Revenue', value: `PKR ${stats.total_revenue.toLocaleString()}`, color: 'green' },
            { label: 'Total Orders', value: stats.total_orders, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 border-${stat.color}-500`}>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex gap-3 flex-wrap">
        {[
          { label: 'All Orders', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Preparing', value: 'preparing' },
          { label: 'Out for Delivery', value: 'out_for_delivery' },
          { label: 'Completed', value: 'completed' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-6 py-2 rounded-full font-label-bold transition-all active:scale-95 ${
              statusFilter === filter.value
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-on-surface-variant font-body-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                        <p className="text-xs text-slate-500">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-right">
                      PKR {order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded text-xs font-bold hover:border-primary focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
