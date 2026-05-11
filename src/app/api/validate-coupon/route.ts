import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') return NextResponse.json({ error: 'Code promo requis' }, { status: 400 });

    const coupon = await stripe.coupons.retrieve(code.trim());
    if (!coupon || !coupon.valid) return NextResponse.json({ error: 'Code promo invalide ou expire' }, { status: 400 });

    return NextResponse.json({ valid: true, coupon: { id: coupon.id, percent_off: coupon.percent_off, amount_off: coupon.amount_off } });
  } catch (error: any) {
    if (error?.code === 'resource_missing') return NextResponse.json({ error: 'Code promo introuvable' }, { status: 400 });
    return NextResponse.json({ error: 'Erreur de validation' }, { status: 500 });
  }
}
