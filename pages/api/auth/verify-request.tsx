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

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [trimmed]
    );

    let userId: string;
    if (userResult.rowCount === 0) {
      const newUser = await client.query(
        "INSERT INTO users (email, email_verified, created_at) VALUES ($1, false, now()) RETURNING id",
        [trimmed]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
      await client.query(
        "UPDATE users SET email_verified = false WHERE id = $1",
        [userId]
      );
    }

    await client.query(
      "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, now() + interval '24 hours')",
      [trimmed, tokenHash]
    );

    await client.query("COMMIT");

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify?token=${token}`;
    console.log(`[verify] link for ${trimmed}: ${verifyUrl}`);

    if (process.env.EMAIL_SERVER) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: trimmed,
        subject: "Verify your Bartender Sanctuary account",
        text: `Verify your email: ${verifyUrl}`,
        html: `<p>Click to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "If that email exists, a verification link has been sent.",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[verify-request]", error);
    return bad(res, 500, "Something went wrong.");
  } finally {
    client.release();
  }
}
