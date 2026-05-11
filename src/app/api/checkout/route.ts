import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour commander' },
        { status: 401 }
      );
    }

    const { items, coupon } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Fetch products from Supabase
    const productIds = items.map((item: { productId: string }) => item.productId);
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Produits introuvables' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.title,
            images: product.images?.slice(0, 1) || [],
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    // Create checkout session
    const sessionConfig: Record<string, unknown> = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        items: JSON.stringify(items),
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
    };

    // Apply coupon if provided
    if (coupon) {
      sessionConfig.discounts = [{ coupon }];
    }

    const session = await stripe.checkout.sessions.create(
      sessionConfig as Parameters<typeof stripe.checkout.sessions.create>[0]
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
