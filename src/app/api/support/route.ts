import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1503526793980805256/CUdwxQ9iwmdbxRBH_EJRMJVxc3FLzfOwBOZem64sbEuuicHRFO3yPxNOl8PE8Uf3VUhQ';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    // Get current user if logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Save ticket to database
    const adminClient = createAdminClient();
    const { data: ticket, error } = await adminClient.from('support_tickets').insert({
      user_id: user?.id || null,
      name,
      email,
      subject,
      message,
      status: 'open',
    }).select().single();

    if (error) {
      console.error('Failed to create ticket:', error);
      return NextResponse.json({ error: 'Erreur lors de la creation du ticket' }, { status: 500 });
    }

    // Send Discord notification
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📩 Nouveau ticket support',
            color: 0x8B5CF6,
            fields: [
              { name: 'Nom', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Sujet', value: subject, inline: false },
              { name: 'Message', value: message.slice(0, 1000), inline: false },
            ],
            footer: { text: `Ticket #${ticket.id.slice(0, 8)}` },
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch (discordError) {
      console.error('Discord webhook failed:', discordError);
      // Non-blocking - ticket is still saved
    }

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
