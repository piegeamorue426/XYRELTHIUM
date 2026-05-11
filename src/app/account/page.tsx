import React from 'react';
import { redirect } from 'next/navigation';
import { Package, User, MessageCircle } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Profile, Order } from '@/types/database';

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  paid: { label: 'Payee', variant: 'info' },
  shipped: { label: 'Expediee', variant: 'info' },
  delivered: { label: 'Livree', variant: 'success' },
};

export default async function AccountPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null };

  // Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Order[] | null };

  // Fetch support tickets
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Mon compte</h1>

          {/* Profile Section */}
          <Card padding="lg" className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {profile?.full_name || 'Utilisateur'}
                  </h2>
                  <p className="text-sm text-white/50">{user.email}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </Card>

          {/* Support Tickets Section - EN HAUT */}
          {tickets && tickets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-violet-400" />
                Mes tickets support
              </h2>
              <div className="space-y-3">
                {(tickets as any[]).map((ticket) => (
                  <a key={ticket.id} href={`/support/${ticket.id}`} className="block">
                    <Card padding="md" className="hover:border-violet-500/30 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-white">{ticket.subject}</span>
                          <p className="text-xs text-white/40 mt-1">
                            {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <Badge variant={ticket.status === 'open' ? 'warning' : ticket.status === 'replied' ? 'info' : 'default'}>
                          {ticket.status === 'open' ? 'En attente' : ticket.status === 'replied' ? 'Repondu' : 'Ferme'}
                        </Badge>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Orders Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-400" />
              Mes commandes
            </h2>

            {!orders || orders.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50">
                    Vous n&apos;avez pas encore de commande.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusLabels[order.status] || statusLabels.pending;
                  return (
                    <Card key={order.id} padding="md">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                Commande #{order.id.slice(0, 8)}
                              </span>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-white">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                        {/* Liste des articles */}
                        <div className="border-t border-white/5 pt-3 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/70">
                                  {item.quantity}x
                                </span>
                                <span className="text-sm text-white">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-sm text-white/60">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
