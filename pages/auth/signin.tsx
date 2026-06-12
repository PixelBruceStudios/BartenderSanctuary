import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { email, password, redirect: false };
    console.log("[signin] submitting", { email, passwordLen: password.length });

    const res = await signIn("credentials", payload);

    console.log("[signin] response", res);

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bartender Sanctuary</h1>
        <p style={styles.subtitle}>Sign in to continue</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="you@example.com"
          />
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="••••••••"
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <a href="/auth/signup" style={styles.link}>Sign up</a>
        </p>
      </div>
    </div>
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
  error: {
    color: "#ef4444",
    fontSize: 13,
    margin: 0,
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
