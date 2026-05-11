'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  admin_reply: string | null;
  created_at: string;
}

const statusConfig = {
  open: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  replied: { label: 'Repondu', variant: 'info' as const, icon: CheckCircle },
  closed: { label: 'Ferme', variant: 'default' as const, icon: XCircle },
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    const res = await fetch('/api/admin/support');
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleReply = async () => {
    if (!selectedTicket || !reply.trim()) return;
    setSending(true);
    await fetch('/api/admin/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: selectedTicket.id, reply: reply.trim(), status: 'replied' }),
    });
    setSending(false);
    setReply('');
    setSelectedTicket(null);
    fetchTickets();
  };

  const handleClose = async (ticketId: string) => {
    await fetch('/api/admin/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, reply: null, status: 'closed' }),
    });
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-violet-400" />
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <Badge variant="info">{tickets.filter(t => t.status === 'open').length} en attente</Badge>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="animate-pulse bg-white/5 h-24 rounded-xl" />)}</div>
      ) : tickets.length === 0 ? (
        <Card padding="lg"><p className="text-center text-white/50">Aucun ticket pour le moment</p></Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const config = statusConfig[ticket.status];
            const Icon = config.icon;
            return (
              <Card key={ticket.id} padding="md">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{ticket.subject}</span>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {ticket.name} ({ticket.email}) - {formatDate(ticket.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {ticket.status !== 'closed' && (
                        <>
                          <button onClick={() => { setSelectedTicket(ticket); setReply(ticket.admin_reply || ''); }}
                            className="text-xs px-2 py-1 bg-violet-600/20 text-violet-400 rounded border border-violet-500/20 hover:bg-violet-600/30">
                            Repondre
                          </button>
                          <button onClick={() => handleClose(ticket.id)}
                            className="text-xs px-2 py-1 bg-white/5 text-white/50 rounded border border-white/10 hover:bg-white/10">
                            Fermer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">{ticket.message}</p>
                  {ticket.admin_reply && (
                    <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                      <p className="text-xs text-violet-400 mb-1 font-medium">Reponse de cesmax :</p>
                      <p className="text-sm text-white/70">{ticket.admin_reply}</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-[#111118] border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Repondre a {selectedTicket.name}</h3>
            <p className="text-xs text-white/40 mb-4">Sujet : {selectedTicket.subject}</p>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Votre reponse..."
              rows={4}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button onClick={handleReply} variant="primary" loading={sending} icon={<Send className="h-4 w-4" />}>
                Envoyer
              </Button>
              <Button onClick={() => setSelectedTicket(null)} variant="secondary">
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
