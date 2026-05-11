import { formatPrice } from './utils';

interface OrderConfirmationData {
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}

export function getOrderConfirmationHtml({ orderNumber, items, total }: OrderConfirmationData): string {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #374151; color: #E5E7EB;">
          ${item.name}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #374151; color: #9CA3AF; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #374151; color: #E5E7EB; text-align: right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 24px; font-weight: bold; background: linear-gradient(to right, #8B5CF6, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
        XYRELTHIUM
      </h1>
    </div>

    <!-- Content -->
    <div style="background-color: #111827; border: 1px solid #1F2937; border-radius: 12px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: rgba(139, 92, 246, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 28px;">✓</span>
        </div>
        <h2 style="color: #FFFFFF; font-size: 20px; margin: 0 0 8px;">Commande confirmée !</h2>
        <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
          Merci pour votre commande #${orderNumber}
        </p>
      </div>

      <!-- Order Items -->
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 1px solid #374151; color: #6B7280; font-size: 12px; text-transform: uppercase;">Produit</th>
            <th style="text-align: center; padding: 8px 0; border-bottom: 1px solid #374151; color: #6B7280; font-size: 12px; text-transform: uppercase;">Qté</th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 1px solid #374151; color: #6B7280; font-size: 12px; text-transform: uppercase;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Total -->
      <div style="text-align: right; padding-top: 16px; border-top: 2px solid #374151;">
        <span style="color: #9CA3AF; font-size: 14px;">Total : </span>
        <span style="color: #FFFFFF; font-size: 20px; font-weight: bold;">${formatPrice(total)}</span>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://xyrelthium.com'}/account" 
           style="display: inline-block; padding: 12px 32px; background: linear-gradient(to right, #8B5CF6, #6366F1); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
          Suivre ma commande
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #6B7280; font-size: 12px; margin: 0;">
        Vous recevez cet email car vous avez passé une commande sur Xyrelthium.
      </p>
      <p style="color: #4B5563; font-size: 12px; margin: 8px 0 0;">
        © ${new Date().getFullYear()} Xyrelthium. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>`;
}
