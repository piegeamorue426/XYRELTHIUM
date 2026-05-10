'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';
import { Package, MapPin, CreditCard, Clock } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
}

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

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-6 rounded-xl border border-white/5 bg-[#0d0d14] p-6">
      {/* Status Timeline */}
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4 text-white/40" />
        <span className="text-sm text-white/50">Statut:</span>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            statusColors[order.status] || 'text-white/60 bg-white/5'
          )}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      {/* Order Items */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-white/40" />
          <h4 className="text-sm font-medium text-white/70">Articles</h4>
        </div>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-[#111118] p-3"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-10 w-10 rounded-md object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-white/40">Qte: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-white">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-white/40" />
            <h4 className="text-sm font-medium text-white/70">Adresse de livraison</h4>
          </div>
          <div className="rounded-lg bg-[#111118] p-3 text-sm text-white/60">
            <p>{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.postal_code} {order.shipping_address.city}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>
      )}

      {/* Payment Info */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/50">Total</span>
        </div>
        <span className="text-lg font-bold text-white">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
