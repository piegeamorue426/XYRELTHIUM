'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { StatsCard } from '@/components/admin/StatsCard';
import { DollarSign, ShoppingBag, Package, CheckCircle } from 'lucide-react';
import type { Order, Product } from '@/types/database';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  availableProducts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) setRecentOrders(orders as Order[]);

      // Fetch top products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (products) setTopProducts(products as Product[]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    paid: 'Paye',
    shipped: 'Expedie',
    delivered: 'Livre',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-[#111118] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Ventes totales"
          value={formatPrice(stats?.totalRevenue || 0)}
        />
        <StatsCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Commandes"
          value={String(stats?.totalOrders || 0)}
        />
        <StatsCard
          icon={<Package className="h-5 w-5" />}
          label="Produits"
          value={String(stats?.totalProducts || 0)}
        />
        <StatsCard
          icon={<CheckCircle className="h-5 w-5" />}
          label="En stock"
          value={String(stats?.availableProducts || 0)}
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Commandes recentes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-white/40">Aucune commande pour le moment</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Date</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Client</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Total</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-sm text-white/70">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 text-sm text-white/70">{order.user_id.slice(0, 8)}...</td>
                    <td className="py-3 text-sm font-medium text-white">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Produits recents</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-white/40">Aucun produit pour le moment</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg bg-[#0d0d14] p-3"
              >
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.title}</p>
                  <p className="text-xs text-white/40">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-violet-300">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
