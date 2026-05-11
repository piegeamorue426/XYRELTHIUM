'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import CartItem from './CartItem';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrice, cn } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    setIsOpen,
    coupon,
    setCoupon,
    discount,
    setDiscount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleValidateCoupon = async () => {
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error || 'Code promo invalide');
        setCoupon(null);
        setDiscount(0);
        return;
      }

      setCoupon(data.couponId);
      setDiscount(data.percentOff || 0);
      setCouponSuccess(
        data.percentOff
          ? `Code appliqué ! -${data.percentOff}%`
          : `Code appliqué ! -${formatPrice(data.amountOff || 0)}`
      );
    } catch {
      setCouponError('Erreur lors de la validation du code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          coupon: coupon || undefined,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Handle error
    } finally {
      setCheckoutLoading(false);
    }
  };

  const discountedTotal = discount > 0 ? total * (1 - discount / 100) : total;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            Panier ({itemCount})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3m2 10v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>
              <p className="text-gray-500">Votre panier est vide</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with coupon and checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-800 p-4 space-y-4">
            {/* Coupon Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Code promo"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="text-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleValidateCoupon}
                  loading={couponLoading}
                  className="flex-shrink-0"
                >
                  Appliquer
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-red-400">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-xs text-green-400">{couponSuccess}</p>
              )}
            </div>

            {/* Total */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Réduction ({discount}%)</span>
                  <span>-{formatPrice(total - discountedTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-white pt-1 border-t border-gray-800">
                <span>Total</span>
                <span>{formatPrice(discountedTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              loading={checkoutLoading}
              className="w-full"
              size="lg"
            >
              Commander
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
