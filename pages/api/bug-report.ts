import type { NextApiRequest, NextApiResponse } from 'next';
import { resend } from '@/lib/email';

type BugReportBody = {
  name?: string;
  email?: string;
  description?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { name, email, description } = req.body as BugReportBody;
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedDesc = (description || '').trim();

  if (!trimmedDesc) {
    return res.status(400).json({ ok: false, error: 'Description is required.' });
  }

  if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ ok: false, error: 'Enter a valid email.' });
  }

  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const to = process.env.BUG_REPORT_TO || 'pixelbruce.3d@gmail.com';

  try {
    await resend.emails.send({
      from,
      to,
      subject: trimmedName ? `Bug Report from ${trimmedName}` : 'New Bug Report — Bartender Sanctuary',
      replyTo: trimmedEmail || undefined,
      text: [
        trimmedName ? `From: ${trimmedName}` : 'Anonymous report',
        trimmedEmail ? `Email: ${trimmedEmail}` : 'No email provided',
        '',
        'Description:',
        trimmedDesc,
      ].join('\n'),
      html: `
        <div style="font-family: Inter, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.25rem;">🐛 New Bug Report</h2>
          <p style="margin: 0 0 0.25rem;"><strong>From:</strong> ${trimmedName || 'Anonymous'}</p>
          ${trimmedEmail ? `<p style="margin: 0 0 0.5rem;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>` : ''}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0.75rem 0;" />
          <p style="margin: 0; white-space: pre-wrap;">${trimmedDesc.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('[bug-report]', error);
    return res.status(500).json({ ok: false, error: 'Failed to send report.' });
  }
}
