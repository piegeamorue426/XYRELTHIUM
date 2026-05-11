import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping email to', to);
    return;
  }

  const { getOrderConfirmationHtml } = await import('./email-templates');

  const html = getOrderConfirmationHtml({ orderNumber, items, total });

  await resend.emails.send({
    from: 'Xyrelthium <commandes@xyrelthium.com>',
    to,
    subject: `Confirmation de commande #${orderNumber}`,
    html,
  });
}
