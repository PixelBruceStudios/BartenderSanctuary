import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

type DashboardProps = {
  initialSession?: { user?: { id: string; email: string; name?: string | null; emailVerified?: boolean } } | null;
};

export default function Dashboard({ initialSession }: DashboardProps) {
  const { data: session, status } = useSession();
  const effectiveSession = initialSession ?? session;
  const user = effectiveSession?.user;

  const [progress, setProgress] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const initials =
    (user?.name ?? user?.email ?? "?")
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const completedLessons = progress.filter((p: any) => p.full_test_passed).length;
  const allSubsPassed = progress.filter((p: any) => p.all_subtests_passed).length;
  const overallProgress =
    progress.length === 0 ? 0 : Math.round((completedLessons / progress.length) * 100);

  const level = completedLessons < 3 ? "Apprentice" : completedLessons < 8 ? "Journeyman" : "Master";

  const loadProgress = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        fetch("/api/user/progress/lesson", { credentials: "include" }),
        fetch("/api/user/tests/attempt", { credentials: "include" }),
      ]);
      if (pRes.ok) setProgress(await pRes.json());
      if (aRes.ok) setAttempts(await aRes.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) loadProgress();
  }, [user?.id, loadProgress]);

  if (status === "loading" || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080c", color: "#e5e7eb" }}>
        <Head><title>Dashboard · Bartender Sanctuary</title></Head>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 48px" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{ color: "#a5b4fc", fontSize: "0.9rem", textDecoration: "none" }}>← Back to library</Link>
            <button
              onClick={() => signIn("email")}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(99,102,241,0.4)",
                background: "rgba(99,102,241,0.1)",
                color: "#a5b4fc",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Sign in
            </button>
          </div>
          <div
            style={{
              padding: "3rem 1.5rem",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>
              Sign in to save your progress, track lesson completion, and pick up where you left off.
            </div>
            <button
              onClick={() => signIn("email")}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(99,102,241,0.5)",
                background: "rgba(99,102,241,0.15)",
                color: "#a5b4fc",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              Sign in with email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#08080c", color: "#e5e7eb" }}>
      <Head><title>Dashboard · Bartender Sanctuary</title></Head>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 48px" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.08em",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{user.name || user.email}</div>
            <div style={{ fontSize: 13, color: "#a1a1aa" }}>{user.email} · {user.emailVerified ? "Verified" : "Unverified"}</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              href="/"
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "0.85rem",
              }}
            >
              Library
            </Link>
            <button
              onClick={() => signOut()}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(248,113,113,0.3)",
                background: "rgba(248,113,113,0.08)",
                color: "#f87171",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6 }}>Experience level</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{level}</div>
            <p style={{ fontSize: 12, color: "#a1a1aa", marginTop: 8, lineHeight: 1.5 }}>
              {completedLessons} full lessons completed
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6 }}>Progress</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{overallProgress}%</div>
            <div
              style={{
                marginTop: 8,
                height: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${overallProgress}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: "#a1a1aa", marginTop: 8, lineHeight: 1.5 }}>
              {completedLessons} of {progress.length || "?"} full lessons passed
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6 }}>Sublesson mastery</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {allSubsPassed}/{progress.length}
            </div>
            <p style={{ fontSize: 12, color: "#a1a1aa", marginTop: 8, lineHeight: 1.5 }}>
              Lessons with all sublesson checks passed
            </p>
          </div>
        </section>

        <section
          style={{
            padding: 18,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Your Journey</h2>
            <button
              onClick={loadProgress}
              disabled={loading}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {progress.length === 0 ? (
            <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.6 }}>
              No tracked lessons yet. Start a lesson and pass its test to begin tracking your progress here.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {progress.map((p: any) => (
                <div
                  key={p.lesson_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                      {p.full_test_passed ? "✓ " : ""}{p.lesson_title ?? `Lesson ${p.lesson_id.slice(0, 8)}`}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>
                      {p.all_subtests_passed ? "All sublesson checks passed" : "Sublesson checks in progress"} · {p.overall_progress}%
                    </div>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      width: "120px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${p.overall_progress}%`,
                        borderRadius: "3px",
                        background: p.full_test_passed
                          ? "linear-gradient(90deg, #4ade80, #22c55e)"
                          : p.all_subtests_passed
                          ? "linear-gradient(90deg, #6366f1, #a855f7)"
                          : "rgba(255,255,255,0.2)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  {p.full_test_passed && (
                    <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 600 }}>Completed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {attempts.length > 0 && (
          <section
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Recent Test Attempts</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {attempts.slice(0, 20).map((a: any) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                      {a.passed ? "✓" : "✗"} Test {a.test_id.slice(0, 8)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>
                      Attempt #{a.attempts} · {new Date(a.last_attempt_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: a.passed ? "#4ade80" : "#f87171" }}>
                    {a.score}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
