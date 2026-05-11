import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code promo requis' },
        { status: 400 }
      );
    }

    const coupon = await stripe.coupons.retrieve(code);

    if (!coupon || !coupon.valid) {
      return NextResponse.json(
        { error: 'Code promo invalide ou expiré' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      couponId: coupon.id,
      percentOff: coupon.percent_off || null,
      amountOff: coupon.amount_off || null,
      currency: coupon.currency,
      name: coupon.name,
    });
  } catch (error: unknown) {
    const stripeError = error as { statusCode?: number };
    if (stripeError.statusCode === 404) {
      return NextResponse.json(
        { error: 'Code promo introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la validation du code promo' },
      { status: 500 }
    );
  }
}
