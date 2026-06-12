import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { resend } from "../../../lib/email";
import { pool } from "../../../lib/db";

type ApiError = { ok: false; error: string };
type ApiSuccess = { ok: true; message: string };
type ApiResponse = ApiSuccess | ApiError;

function bad(res: NextApiResponse<ApiError>, status: number, error: string) {
  return res.status(status).json({ ok: false, error });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== "POST") {
    return bad(res, 405, "Method Not Allowed");
  }

  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  const trimmedEmail = (email || "").trim().toLowerCase();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return bad(res, 400, "Enter a valid email.");
  }
  if (!password || password.length < 8) {
    return bad(res, 400, "Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [trimmedEmail]
    );
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return bad(res, 409, "Email already registered.");
    }

    const newUser = await client.query(
      "INSERT INTO users (email, name, password_hash, email_verified, created_at) VALUES ($1, $2, $3, false, now()) RETURNING id",
      [trimmedEmail, name?.trim() || null, passwordHash]
    );
    const userId = newUser.rows[0].id;

    await client.query(
      "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, now() + interval '24 hours')",
      [trimmedEmail, tokenHash]
    );

    await client.query("COMMIT");

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify?token=${token}`;
    console.log(`[register] verification link for ${trimmedEmail}: ${verifyUrl}`);

    // Email send is best-effort; registration should succeed even if email fails
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: trimmedEmail,
          subject: "Verify your Bartender Sanctuary account",
          text: `Verify your email: ${verifyUrl}`,
          html: `<p>Click to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        });
      } catch (emailError) {
        console.error("[register] email send failed:", emailError);
      }
    }

    return res.status(201).json({ ok: true, message: "Account created. Check your email to verify." });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    const message = error instanceof Error ? error.message : "Something went wrong.";
    console.error("[register]", error);
    return bad(res, 500, message);
  } finally {
    client.release();
  }
}
