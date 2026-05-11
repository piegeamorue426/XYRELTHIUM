import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Non autorise' }, { status: 403 });

  const { data: tickets } = await adminClient.from('support_tickets').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ tickets: tickets || [] });
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Non autorise' }, { status: 403 });

  const { ticketId, reply, status } = await request.json();

  const { error } = await adminClient.from('support_tickets').update({
    admin_reply: reply,
    status: status || 'replied',
    updated_at: new Date().toISOString(),
  }).eq('id', ticketId);

  if (error) return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Non autorise' }, { status: 403 });

  const { ticketId } = await request.json();
  await adminClient.from('support_messages').delete().eq('ticket_id', ticketId);
  await adminClient.from('support_tickets').delete().eq('id', ticketId);

  return NextResponse.json({ success: true });
}
