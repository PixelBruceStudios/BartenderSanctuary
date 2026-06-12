import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

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

  const { email } = req.body as { email?: string };
  const trimmed = (email || "").trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return bad(res, 400, "Enter a valid email.");
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return bad(res, 500, "Database not configured.");
  }

  const poolModule = await import("@vercel/postgres");
  const pgModule = await import("pg");
  const pool = poolModule.default;
  const client = new (pool ? pool(dbUrl) : pgModule.Client(dbUrl));

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id, email_verified FROM users WHERE email = $1",
      [trimmed]
    );
    if (userResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return bad(res, 404, "No account found for that email.");
    }

    const userRow = userResult.rows[0] as { id: string; email_verified: boolean };
    if (userRow.email_verified) {
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
    console.log(`[resend] verification link for ${trimmed}: ${verifyUrl}`);

    if (process.env.EMAIL_SERVER) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 465),
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
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
    await client.end().catch(() => {});
  }
}
