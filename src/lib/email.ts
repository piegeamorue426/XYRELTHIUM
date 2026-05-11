let resend: any = null;

if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
}

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

  const formatEur = (cents: number) => (cents / 100).toFixed(2).replace('.', ',') + ' €';

  const itemRows = items
    .map((item) => `<tr><td style="padding:8px 0;color:#e0e0e0;">${item.name}</td><td style="padding:8px 0;color:#a0a0b0;text-align:center;">${item.quantity}</td><td style="padding:8px 0;color:#e0e0e0;text-align:right;">${formatEur(item.price * item.quantity)}</td></tr>`)
    .join('');

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0f;font-family:sans-serif;"><div style="max-width:600px;margin:0 auto;padding:40px 20px;"><div style="background:#111118;border:1px solid rgba(255,255,255,0.05);border-radius:16px;padding:32px;text-align:center;"><h1 style="color:#8B5CF6;font-size:24px;">Xyrelthium</h1><h2 style="color:#fff;font-size:20px;">Commande confirmee !</h2><p style="color:#a0a0b0;font-size:14px;">Merci pour votre achat. Commande #${orderNumber.slice(0, 8)}</p><table style="width:100%;border-collapse:collapse;margin:24px 0;"><thead><tr><th style="padding:8px 0;color:#8B5CF6;text-align:left;font-size:12px;">Produit</th><th style="padding:8px 0;color:#8B5CF6;text-align:center;font-size:12px;">Qte</th><th style="padding:8px 0;color:#8B5CF6;text-align:right;font-size:12px;">Prix</th></tr></thead><tbody>${itemRows}</tbody></table><div style="text-align:right;padding:16px 0;border-top:2px solid #8B5CF6;"><span style="color:#fff;font-size:20px;font-weight:bold;">${formatEur(total)}</span></div></div></div></body></html>`;

  try {
    await resend.emails.send({
      from: 'Xyrelthium <onboarding@resend.dev>',
      to,
      subject: `Confirmation de commande #${orderNumber.slice(0, 8)}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
