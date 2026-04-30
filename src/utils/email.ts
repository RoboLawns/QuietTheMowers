// Email utility — uses Resend HTTP API directly (no SDK needed in Workers)

interface SendEmailOpts {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const FROM_DEFAULT = 'Quiet The Mowers <hello@quietthemowers.com>';

export async function sendEmail(env: any, opts: SendEmailOpts): Promise<{ ok: boolean; error?: string }> {
  const apiKey = env?.RESEND_API_KEY || globalThis.process?.env?.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return { ok: false, error: 'No API key' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from || FROM_DEFAULT,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return { ok: false, error };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

// Email templates
function emailLayout(content: string, preheader = ''): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8f6f2;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">
  <span style="display:none;font-size:1px;color:#f8f6f2">${preheader}</span>
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#284621;font-family:Georgia,serif;font-size:24px;margin:0;">🌱 Quiet The Mowers</h1>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      ${content}
    </div>
    <div style="text-align:center;margin-top:32px;color:#9c7d5f;font-size:12px;">
      <p>Quiet The Mowers · Reclaiming quiet mornings, one neighborhood at a time</p>
      <p><a href="https://quietthemowers.com" style="color:#4e8c42;">quietthemowers.com</a> · <a href="https://quietthemowers.com/privacy" style="color:#9c7d5f;">Privacy</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendWelcomeEmail(env: any, to: string, name: string) {
  return sendEmail(env, {
    to,
    subject: 'Welcome to Quiet The Mowers',
    html: emailLayout(`
      <h2 style="color:#284621;font-family:Georgia,serif;margin-top:0;">Welcome, ${name}!</h2>
      <p style="color:#58473a;line-height:1.6;">Thanks for joining the movement. You're now part of a growing community of neighbors working to make our neighborhoods quieter.</p>
      <h3 style="color:#284621;font-family:Georgia,serif;">Three ways to get started:</h3>
      <ol style="color:#58473a;line-height:1.8;">
        <li><strong>Sign the national petition</strong> — show baseline support<br><a href="https://quietthemowers.com/petition" style="color:#4e8c42;">Sign now →</a></li>
        <li><strong>Start a local campaign</strong> — target your HOA or city<br><a href="https://quietthemowers.com/campaigns/new" style="color:#4e8c42;">Get the templates →</a></li>
        <li><strong>Read the manifesto</strong> — understand the why<br><a href="https://quietthemowers.com/manifesto" style="color:#4e8c42;">Read it →</a></li>
      </ol>
      <p style="color:#58473a;line-height:1.6;margin-top:24px;">Questions? Reply to this email — we read every one.</p>
    `, 'Welcome to Quiet The Mowers'),
  });
}

export async function sendSignatureConfirmation(env: any, to: string, name: string, campaignTitle: string, campaignSlug: string) {
  return sendEmail(env, {
    to,
    subject: `Thank you for signing: ${campaignTitle}`,
    html: emailLayout(`
      <h2 style="color:#284621;font-family:Georgia,serif;margin-top:0;">Thank you, ${name}!</h2>
      <p style="color:#58473a;line-height:1.6;">Your signature has been added to <strong>${campaignTitle}</strong>. Every name moves us closer to quieter neighborhoods.</p>
      <div style="background:#f0f7ed;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <a href="https://quietthemowers.com/campaigns/${campaignSlug}" style="display:inline-block;background:#4e8c42;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Campaign</a>
      </div>
      <h3 style="color:#284621;font-family:Georgia,serif;">Help spread the word:</h3>
      <p style="color:#58473a;line-height:1.6;">Share this campaign with three neighbors. Personal asks are 10x more effective than social media.</p>
      <ul style="color:#58473a;line-height:1.8;">
        <li>Send the link to your block's group chat</li>
        <li>Post on Nextdoor or your neighborhood Facebook</li>
        <li>Email your HOA board members</li>
      </ul>
    `, 'Signature confirmed'),
  });
}

export async function sendCampaignUpdate(env: any, to: string, name: string, updateTitle: string, updateBody: string, campaignSlug: string) {
  return sendEmail(env, {
    to,
    subject: `Update: ${updateTitle}`,
    html: emailLayout(`
      <h2 style="color:#284621;font-family:Georgia,serif;margin-top:0;">${updateTitle}</h2>
      <p style="color:#58473a;line-height:1.6;">Hi ${name},</p>
      <div style="color:#58473a;line-height:1.6;">${updateBody.split('\n').map(l => `<p>${l}</p>`).join('')}</div>
      <div style="background:#f0f7ed;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <a href="https://quietthemowers.com/campaigns/${campaignSlug}" style="display:inline-block;background:#4e8c42;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Latest</a>
      </div>
    `, updateTitle),
  });
}
