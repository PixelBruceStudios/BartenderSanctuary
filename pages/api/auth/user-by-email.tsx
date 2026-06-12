import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../../lib/db";

type ApiError = { ok: false; error: string };
type ApiSuccess = { ok: true; user: { id: string; email: string; name?: string | null; email_verified: boolean } };
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
  if (!trimmed) {
    return bad(res, 400, "Email is required.");
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return bad(res, 500, "Database not configured.");
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, email, name, password_hash, email_verified FROM users WHERE email = $1",
      [trimmed]
    );

    if (result.rows.length === 0) {
      return bad(res, 404, "No account found.");
    }

    const row = result.rows[0] as { id: string; email: string; name?: string | null; password_hash: string; email_verified: boolean };
    return res.status(200).json({ ok: true, user: row });
  } catch (error) {
    console.error("[user-by-email]", error);
    return bad(res, 500, "Something went wrong.");
  } finally {
    client.release();
  }
}
