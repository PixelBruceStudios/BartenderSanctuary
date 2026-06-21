import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import SEO from '@/components/SEO';

export default function VerifyRequest() {
  const router = useRouter();
  const { email: emailParam } = router.query;
  const [email, setEmail] = useState((emailParam as string) || "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await fetch("/api/auth/verify-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(data.message || "Verification email sent.");
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <>
      <SEO title="Verify Email" description="Verify your email address to activate your Bartender Sanctuary account." path="/auth/verify-request" noindex />
      <div style={styles.page}>
        <div style={styles.card}>
        <h1 style={styles.title}>Verify your email</h1>
        <p style={styles.subtitle}>
          We'll send a verification link to your email address.
        </p>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="you@example.com"
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Sending..." : "Send verification email"}
          </button>
        </form>
        <p style={styles.footer}>
          <Link href="/auth/signin" style={styles.link}>Back to sign in</Link>
        </p>
      </div>
    </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 40,
    backdropFilter: "blur(12px)",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
    background: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    textAlign: "center",
    color: "#a1a1aa",
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontSize: 13,
    color: "#d4d4d8",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },
  success: {
    color: "#22c55e",
    fontSize: 14,
    margin: 0,
    textAlign: "center",
  },
  error: {
    color: "#ef4444",
    fontSize: 13,
    margin: 0,
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    color: "#a1a1aa",
    fontSize: 14,
  },
  link: {
    color: "#f59e0b",
    textDecoration: "none",
  },
};
