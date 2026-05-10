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
      const items = JSON.parse(metadata.items || '[]');

      // Calculate total from items
      const total = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      );

      // Create order record
      await supabase.from('orders').insert({
        user_id: userId !== 'guest' ? userId : null,
        items,
        total,
        status: 'paid',
        stripe_session_id: session.id,
        shipping_address: null,
      });

      // Update product stock
      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product && product.stock > 0) {
          await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id);
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }

  return NextResponse.json({ received: true });
}
