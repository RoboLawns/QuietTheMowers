// Email verification utilities
import { sendEmail } from './email';

function emailLayout(content: string, preheader = ''): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f6f2;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">
  <span style="display:none">${preheader}</span>
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#284621;font-family:Georgia,serif;font-size:24px;margin:0;">🌱 Quiet The Mowers</h1>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;">${content}</div>
    <div style="text-align:center;margin-top:32px;color:#9c7d5f;font-size:12px;">
      <p>Quiet The Mowers · <a href="https://quietthemowers.com" style="color:#4e8c42;">quietthemowers.com</a></p>
    </div>
  </div>
</body></html>`;
}

export async function sendVerificationEmail(env: any, email: string, name: string, token: string, campaignTitle: string) {
  const verifyUrl = `https://quietthemowers.com/verify?token=${token}`;
  return sendEmail(env, {
    to: email,
    subject: `Confirm your signature: ${campaignTitle}`,
    html: emailLayout(`
      <h2 style="color:#284621;font-family:Georgia,serif;margin-top:0;">Hi ${name},</h2>
      <p style="color:#58473a;line-height:1.6;">Thanks for signing the petition for <strong>${campaignTitle}</strong>. Please confirm your email address so we can count your signature.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}" style="display:inline-block;background:#4e8c42;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Confirm My Signature</a>
      </div>
      <p style="color:#58473a;font-size:14px;line-height:1.6;">Or paste this link into your browser:<br><a href="${verifyUrl}" style="color:#4e8c42;word-break:break-all;">${verifyUrl}</a></p>
      <p style="color:#9c7d5f;font-size:12px;margin-top:24px;">If you didn't sign this petition, you can safely ignore this email. The link expires in 7 days.</p>
    `, `Confirm: ${campaignTitle}`),
  });
}

export function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
