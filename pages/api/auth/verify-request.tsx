import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";
import { resend } from "../../../lib/email";
import { pool } from "../../../lib/db";

function bad(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ ok: false, error: message });
}

const WINDOW_MS = 60_000;
const MAX_VERIFY_REQUESTS_PER_WINDOW = 5;
const verifyRequestHits = new Map<string, { count: number; reset: number }>();

function verifyRequestClientIp(req: NextApiRequest): string {
  const header = req.headers['x-forwarded-for'];
  const first = typeof header === 'string' ? header.split(',')[0].trim() : null;
  return first || req.socket.remoteAddress || 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return bad(res, 405, "Method Not Allowed");

  const { email } = req.body as { email?: string };
  const trimmed = (email || "").trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return bad(res, 400, "Enter a valid email.");
  }

  const ip = verifyRequestClientIp(req);
  const now = Date.now();
  const windowKey = Math.floor(now / WINDOW_MS);
  const key = `${ip}:${windowKey}`;
  const entry = verifyRequestHits.get(key);
  if (entry) {
    entry.count += 1;
    if (entry.count > MAX_VERIFY_REQUESTS_PER_WINDOW) {
      return bad(res, 429, "Too many verification requests. Try again later.");
    }
  } else {
    verifyRequestHits.set(key, { count: 1, reset: now + WINDOW_MS });
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
    if (userResult.rows.length === 0) {
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

    if (process.env.RESEND_API_KEY) {
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
