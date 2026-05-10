import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = createAdminClient();
      const metadata = session.metadata;

      if (!metadata) {
        console.error('No metadata in session');
        return NextResponse.json({ received: true });
      }

      const userId = metadata.user_id;

      // Retrieve items: try metadata first, fall back to Stripe line items
      // This handles cases where metadata.items was truncated (500-char limit)
      let items: { product_id: string; title: string; price: number; quantity: number; image: string }[];

      try {
        items = JSON.parse(metadata.items || '[]');
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Empty items array');
        }
      } catch {
        // metadata.items was truncated or missing - retrieve from Stripe
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        items = lineItems.data.map((li) => ({
          product_id: (li.price?.metadata?.product_id as string) || '',
          title: li.description || '',
          price: li.price?.unit_amount || 0,
          quantity: li.quantity || 1,
          image: '',
        }));
      }

      // Calculate total from items
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order record
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: userId !== 'guest' ? userId : null,
        items,
        total,
        status: 'paid',
        stripe_session_id: session.id,
        shipping_address: null,
      });

      if (orderError) {
        console.error('Failed to create order:', orderError);
        // Return 500 so Stripe retries delivery
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      // Decrement product stock atomically using database function
      for (const item of items) {
        if (!item.product_id) continue;

        const { error: stockError } = await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (stockError) {
          // Stock update failure is non-critical - log but don't fail the webhook
          // The order is already recorded successfully
          console.error(`Stock decrement failed for product ${item.product_id}:`, stockError);
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Return 500 for transient failures so Stripe retries
      return NextResponse.json(
        { error: 'Internal processing error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
