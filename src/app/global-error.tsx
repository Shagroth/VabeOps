"use client";

// Catches a crash in the root layout itself — must render its own
// <html>/<body> since it replaces the whole document. Deliberately
// styled with inline styles rather than Tailwind classes: if the root
// layout failed, we can't be sure globals.css made it to the page.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f8f5",
          color: "#131a25",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Что-то пошло не так</h1>
        <p style={{ color: "#5b6672", maxWidth: "28rem", margin: 0 }}>
          Приложение не загрузилось. Попробуй обновить страницу.
        </p>
        <button
          type="button"
          onClick={retry}
          style={{
            borderRadius: "0.5rem",
            background: "#0a0f18",
            color: "#f4f5f1",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
        {error.digest && (
          <p style={{ color: "#5b6672", fontSize: "0.75rem" }}>
            Код ошибки: <span style={{ fontFamily: "monospace" }}>{error.digest}</span>
          </p>
        )}
      </body>
    </html>
  );
}
