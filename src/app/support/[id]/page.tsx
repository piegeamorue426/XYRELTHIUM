'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Send, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Message { id: string; sender_role: 'client' | 'admin'; message: string; created_at: string; }
interface Ticket { id: string; subject: string; status: 'open' | 'replied' | 'closed'; created_at: string; }

export default function TicketChatPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: t } = await supabase.from('support_tickets').select('*').eq('id', ticketId).single();
    setTicket(t);
    const { data: msgs } = await supabase.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
    const newMsgs = msgs || [];
    if (newMsgs.length > prevMsgCountRef.current) {
      prevMsgCountRef.current = newMsgs.length;
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    setMessages(newMsgs);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 5000); return () => clearInterval(i); }, [ticketId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !ticket || ticket.status === 'closed') return;
    setSending(true);
    await supabase.from('support_messages').insert({ ticket_id: ticketId, sender_role: 'client', message: newMessage.trim() });
    await supabase.from('support_tickets').update({ status: 'open', updated_at: new Date().toISOString() }).eq('id', ticketId);
    setNewMessage('');
    await fetchData();
    setSending(false);
  };

  const handleClose = async () => {
    await supabase.from('support_tickets').update({ status: 'closed', updated_at: new Date().toISOString() }).eq('id', ticketId);
    await fetchData();
  };

  const formatTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const formatDay = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  if (loading) return <><Header /><main className="min-h-screen flex items-center justify-center"><div className="text-white/50">Chargement...</div></main><Footer /></>;
  if (!ticket) return <><Header /><main className="min-h-screen flex items-center justify-center"><div className="text-white/50">Ticket introuvable</div></main><Footer /></>;

  return (
    <><Header /><main className="min-h-screen"><div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/account" className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5"><ArrowLeft className="h-5 w-5" /></Link>
          <div><h1 className="text-lg font-bold text-white">{ticket.subject}</h1><p className="text-xs text-white/40">Ticket #{ticket.id.slice(0, 8)}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={ticket.status === 'open' ? 'warning' : ticket.status === 'replied' ? 'info' : 'default'}>
            {ticket.status === 'open' ? 'En attente' : ticket.status === 'replied' ? 'Repondu' : 'Ferme'}
          </Badge>
          {ticket.status !== 'closed' && <button onClick={handleClose} className="text-xs px-2 py-1 text-white/50 border border-white/10 rounded hover:bg-white/5">Fermer</button>}
        </div>
      </div>

      <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? <div className="text-center py-12 text-white/30 text-sm">Debut de la conversation</div> : messages.map((msg, i) => {
            const isClient = msg.sender_role === 'client';
            const showDate = i === 0 || formatDay(msg.created_at) !== formatDay(messages[i - 1].created_at);
            return (<React.Fragment key={msg.id}>
              {showDate && <div className="text-center text-xs text-white/30 py-2">{formatDay(msg.created_at)}</div>}
              <div className={cn('flex', isClient ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl', isClient ? 'bg-violet-600 text-white rounded-br-md' : 'bg-white/5 text-white/80 border border-white/10 rounded-bl-md')}>
                  {!isClient && <p className="text-[10px] text-violet-400 font-medium mb-1">cesmax (support)</p>}
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={cn('text-[10px] mt-1', isClient ? 'text-white/60' : 'text-white/30')}>{formatTime(msg.created_at)}</p>
                </div>
              </div>
            </React.Fragment>);
          })}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'closed' ? (
          <div className="p-4 border-t border-white/5"><form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Votre message..."
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
            <Button type="submit" variant="primary" size="sm" loading={sending} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
          </form></div>
        ) : (
          <div className="p-4 border-t border-white/5 text-center"><p className="text-sm text-white/40 flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" />Ce ticket est ferme</p></div>
        )}
      </div>
    </div></main><Footer /></>
  );
}
