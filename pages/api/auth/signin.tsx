import { signIn } from "next-auth/react";

export default async function handler(req: { method: string; body: { email?: string; password?: string } }, res: { status: (code: number) => { json: (arg0: { ok: boolean; user?: { id: string; email: string; name?: string | null; password_hash: string; email_verified: boolean } }) => void } }) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false });
  }

  try {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/user-by-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const userData = await userRes.json();

    if (!userRes.ok || !userData.user) {
      return res.status(401).json({ ok: false });
    }

    const bcrypt = await import("bcryptjs");
    const passwordMatch = await bcrypt.compare(password, userData.user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ ok: false });
    }

    // Return user info for session creation
    return res.status(200).json({
      ok: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.name,
        emailVerified: userData.user.email_verified,
      },
    });
  } catch (error) {
    console.error("[signin]", error);
    return res.status(500).json({ ok: false });
  }
}
