import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  items,
  total,
}: {
  to: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}) {
  const { getOrderConfirmationHtml } = await import('./email-templates');

  const html = getOrderConfirmationHtml({ orderNumber, items, total });

  await resend.emails.send({
    from: 'Xyrelthium <commandes@xyrelthium.com>',
    to,
    subject: `Confirmation de commande #${orderNumber}`,
    html,
  });
}
