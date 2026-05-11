import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import type { OrderItem } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: OrderItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide.' },
        { status: 400 }
      );
    }

    // Try to get user (optional - guest checkout allowed)
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            ...(item.image && item.image.startsWith('http') ? { images: [item.image] } : {}),
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
      metadata: {
        user_id: user?.id || 'guest',
        items: JSON.stringify(
          items.map((item) => ({
            product_id: item.product_id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          }))
        ).slice(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la session de paiement.' },
      { status: 500 }
    );
  }
}
