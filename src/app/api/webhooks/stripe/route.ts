import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendOrderConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
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
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const itemsJson = session.metadata?.items;

    if (!userId || !itemsJson) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const items = JSON.parse(itemsJson) as Array<{ productId: string; quantity: number }>;

    // Fetch products
    const productIds = items.map((i) => i.productId);
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (!products) {
      return NextResponse.json({ error: 'Products not found' }, { status: 400 });
    }

    // Calculate total
    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'paid',
        total,
        stripe_session_id: session.id,
        shipping_address: session.shipping_details?.address || {},
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: products.find((p) => p.id === item.productId)?.price || 0,
    }));

    await supabaseAdmin.from('order_items').insert(orderItems);

    // Update product stock
    for (const item of items) {
      await supabaseAdmin.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity,
      });
    }

    // Send confirmation email
    try {
      const customerEmail = session.customer_email || session.customer_details?.email;
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderNumber: order.id.slice(0, 8).toUpperCase(),
          items: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              name: product?.title || 'Produit',
              quantity: item.quantity,
              price: product?.price || 0,
            };
          }),
          total,
        });
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }
  }

  return NextResponse.json({ received: true });
}
