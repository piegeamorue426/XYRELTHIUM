'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { OrderDetails } from '@/components/admin/OrderDetails';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '@/types/database';

const statusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Paye' },
  { value: 'shipped', label: 'Expedie' },
  { value: 'delivered', label: 'Livre' },
];

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Paye',
  shipped: 'Expedie',
  delivered: 'Livre',
};

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  paid: 'text-emerald-400 bg-emerald-400/10',
  shipped: 'text-blue-400 bg-blue-400/10',
  delivered: 'text-violet-400 bg-violet-400/10',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-[#111118] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Commandes</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-12 text-center">
          <p className="text-white/40">Aucune commande trouvee</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden">
              {/* Order Row */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs text-white/40">ID</p>
                    <p className="text-sm font-mono text-white">{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Date</p>
                    <p className="text-sm text-white/70">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Total</p>
                    <p className="text-sm font-medium text-white">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Produits</p>
                    <p className="text-sm text-white/70">{order.items.length} article(s)</p>
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[order.status] || 'text-white/60 bg-white/5'
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
                <div className="text-white/40">
                  {expandedOrder === order.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-white/5 px-6 py-4">
                  <OrderDetails order={order} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
