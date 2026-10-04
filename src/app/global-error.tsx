"use client";

/** Last-resort error page (the root layout itself failed), so it can't rely on site styles. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07060d", color: "#f4f2ff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "96px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ color: "#9d99b5", margin: "0 0 24px" }}>Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{ background: "#7c5cff", color: "#fff", border: 0, borderRadius: 10, padding: "12px 20px", fontSize: 15, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
