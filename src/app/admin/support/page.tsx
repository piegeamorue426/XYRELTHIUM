'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface Ticket { id: string; name: string; email: string; subject: string; message: string; status: 'open' | 'replied' | 'closed'; created_at: string; }
interface Message { id: string; sender_role: 'client' | 'admin'; message: string; created_at: string; }

const statusConfig = {
  open: { label: 'En attente', variant: 'warning' as const },
  replied: { label: 'Repondu', variant: 'info' as const },
  closed: { label: 'Ferme', variant: 'default' as const },
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);
  const supabase = createClient();

  const fetchTickets = async () => {
    const res = await fetch('/api/admin/support');
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  const fetchMessages = async (ticketId: string) => {
    const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
    const newMsgs = data || [];
    if (newMsgs.length > prevMsgCountRef.current) {
      prevMsgCountRef.current = newMsgs.length;
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    setMessages(newMsgs);
  };

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { if (selectedTicket) { fetchMessages(selectedTicket.id); const i = setInterval(() => fetchMessages(selectedTicket.id), 5000); return () => clearInterval(i); } }, [selectedTicket]);

  const handleReply = async () => {
    if (!selectedTicket || !reply.trim()) return;
    setSending(true);
    await supabase.from('support_messages').insert({ ticket_id: selectedTicket.id, sender_role: 'admin', message: reply.trim() });
    await supabase.from('support_tickets').update({ status: 'replied', updated_at: new Date().toISOString() }).eq('id', selectedTicket.id);
    setReply('');
    await fetchMessages(selectedTicket.id);
    await fetchTickets();
    setSending(false);
  };

  const handleClose = async (ticketId: string) => {
    await fetch('/api/admin/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId, status: 'closed' }) });
    if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    fetchTickets();
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Supprimer ce ticket et tous ses messages ?')) return;
    await fetch('/api/admin/support', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId }) });
    if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    fetchTickets();
  };

  const formatTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-violet-400" />
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <Badge variant="info">{tickets.filter(t => t.status === 'open').length} en attente</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Ticket list */}
        <div className="lg:col-span-1 overflow-y-auto space-y-2 border border-white/5 rounded-xl p-3 bg-[#0d0d14]">
          {loading ? <div className="text-center text-white/50 py-8">Chargement...</div> : tickets.length === 0 ? <div className="text-center text-white/50 py-8">Aucun ticket</div> : tickets.map((ticket) => (
            <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
              className={cn('w-full text-left p-3 rounded-lg transition-all', selectedTicket?.id === ticket.id ? 'bg-violet-600/20 border border-violet-500/30' : 'bg-white/5 border border-white/5 hover:bg-white/10')}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white truncate">{ticket.name}</span>
                <Badge variant={statusConfig[ticket.status].variant}>{statusConfig[ticket.status].label}</Badge>
              </div>
              <p className="text-xs text-white/50 truncate">{ticket.subject}</p>
              <p className="text-[10px] text-white/30 mt-1">{formatDate(ticket.created_at)}</p>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2 flex flex-col border border-white/5 rounded-xl bg-[#111118] overflow-hidden">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center text-white/30 text-sm">Selectionnez un ticket</div>
          ) : (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">{selectedTicket.subject}</h3>
                  <p className="text-xs text-white/40">{selectedTicket.name} - {selectedTicket.email}</p>
                </div>
                {selectedTicket.status !== 'closed' && (
                  <button onClick={() => handleClose(selectedTicket.id)} className="text-xs px-2 py-1 text-white/50 border border-white/10 rounded hover:bg-white/5">Fermer</button>
                )}
                <button onClick={() => handleDelete(selectedTicket.id)} className="text-xs px-2 py-1 text-red-400/70 border border-red-500/20 rounded hover:bg-red-500/10 hover:text-red-400">Supprimer</button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isAdmin = msg.sender_role === 'admin';
                  return (
                    <div key={msg.id} className={cn('flex', isAdmin ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl', isAdmin ? 'bg-violet-600 text-white rounded-br-md' : 'bg-white/5 text-white/80 border border-white/10 rounded-bl-md')}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={cn('text-[10px] mt-1', isAdmin ? 'text-white/60' : 'text-white/30')}>{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              {selectedTicket.status !== 'closed' ? (
                <div className="p-4 border-t border-white/5">
                  <form onSubmit={(e) => { e.preventDefault(); handleReply(); }} className="flex gap-2">
                    <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Repondre..."
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                    <Button type="submit" variant="primary" size="sm" loading={sending} disabled={!reply.trim()}><Send className="h-4 w-4" /></Button>
                  </form>
                </div>
              ) : (
                <div className="p-4 border-t border-white/5 text-center"><p className="text-xs text-white/40">Ticket ferme</p></div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
