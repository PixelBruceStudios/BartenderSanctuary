import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";
import { pool } from "../../../lib/db";

type ApiError = { ok: false; error: string };
type ApiSuccess = { ok: true; message: string };
type ApiResponse = ApiSuccess | ApiError;

function bad(res: NextApiResponse<ApiError>, status: number, error: string) {
  return res.status(status).json({ ok: false, error });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== "GET") {
    return bad(res, 405, "Method Not Allowed");
  }

  const token = typeof req.query.token === "string" ? req.query.token : null;
  if (!token) {
    return bad(res, 400, "Missing token.");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return bad(res, 500, "Database not configured.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      "SELECT id, identifier, expires FROM verification_tokens WHERE token = $1",
      [tokenHash]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return bad(res, 400, "Invalid or expired token.");
    }

    const row = result.rows[0] as { id: string; identifier: string; expires: string };
    const expires = new Date(row.expires);
    if (Number.isNaN(expires.getTime()) || expires < new Date()) {
      await client.query("ROLLBACK");
      return bad(res, 400, "Invalid or expired token.");
    }

    await client.query("UPDATE users SET email_verified = true WHERE email = $1", [
      row.identifier,
    ]);
    await client.query("DELETE FROM verification_tokens WHERE id = $1", [row.id]);

    await client.query("COMMIT");

    return res.status(200).json({ ok: true, message: "Email verified." });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[verify]", error);
    return bad(res, 500, "Something went wrong.");
  } finally {
    client.release();
  }
}
