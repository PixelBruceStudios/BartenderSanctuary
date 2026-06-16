type ApiUser = {
  id: string;
  email: string;
  name?: string | null;
  emailVerified: boolean;
};

import type { NextApiRequest, NextApiResponse } from "next";

function bad(res: NextApiResponse<{ ok: boolean; error?: string }>, status: number, error: string) {
  return res.status(status).json({ ok: false, error } as any);
}

const WINDOW_MS = 60_000;
const MAX_AUTH_ATTEMPTS_PER_WINDOW = 10;
const authHits = new Map<string, { count: number; reset: number }>();

function authClientIp(req: NextApiRequest): string {
  const header = req.headers["x-forwarded-for"];
  const first = typeof header === "string" ? header.split(",")[0].trim() : null;
  return first || req.socket.remoteAddress || "unknown";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ ok: boolean; user?: ApiUser }>) {
  if (req.method !== "POST") {
    return bad(res, 405, "Method Not Allowed");
  }

  const ip = authClientIp(req);
  const now = Date.now();
  const windowKey = Math.floor(now / WINDOW_MS);
  const key = `${ip}:${windowKey}`;
  const entry = authHits.get(key);
  if (entry) {
    entry.count += 1;
    if (entry.count > MAX_AUTH_ATTEMPTS_PER_WINDOW) {
      return bad(res, 429, "Too many attempts. Try again later.");
    }
  } else {
    authHits.set(key, { count: 1, reset: now + WINDOW_MS });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return bad(res, 400, "Email and password are required.");
  }

  try {
    const proto = req.headers["x-forwarded-proto"]?.toString() || "http";
    const host = req.headers.host || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const baseUrl = `${proto}://${host}`;
    const userRes = await fetch(`${baseUrl}/api/auth/user-by-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const userData = await userRes.json();

    if (!userRes.ok || !userData.user) {
      return res.status(401).json({ ok: false } as any);
    }

    const bcrypt = await import("bcryptjs");
    const passwordMatch = await bcrypt.compare(password, userData.user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ ok: false } as any);
    }

    return res.status(200).json({
      ok: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.name,
        emailVerified: (userData.user as any).email_verified,
      },
    });
  } catch (error) {
    console.error("[signin]", error);
    return res.status(500).json({ ok: false } as any);
  }
}
