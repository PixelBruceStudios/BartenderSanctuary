import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";
import { resend } from "../../../lib/email";
import { pool } from "../../../lib/db";

function bad(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ ok: false, error: message });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return bad(res, 405, "Method Not Allowed");

  const { email } = req.body as { email?: string };
  const trimmed = (email || "").trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return bad(res, 400, "Enter a valid email.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id, email_verified FROM users WHERE email = $1",
      [trimmed]
    );
    if (existing.rowCount === 0) {
      await client.query("ROLLBACK");
      return bad(res, 404, "No account found for that email.");
    }

    const user = existing.rows[0] as { id: string; email_verified: boolean };
    if (user.email_verified) {
      await client.query("ROLLBACK");
      return res.status(200).json({ ok: true, message: "Email already verified. You can sign in." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await client.query(
      "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, now() + interval '24 hours')",
      [trimmed, tokenHash]
    );

    await client.query("COMMIT");

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify?token=${token}`;

    if (process.env.EMAIL_SERVER) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: trimmed,
        subject: "Verify your Bartender Sanctuary account",
        text: `Verify your email: ${verifyUrl}`,
        html: `<p>Click to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
      });
    }

    return res.status(200).json({ ok: true, message: "Verification email sent." });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[resend-verification]", error);
    return bad(res, 500, "Something went wrong.");
  } finally {
    client.release();
  }
}
