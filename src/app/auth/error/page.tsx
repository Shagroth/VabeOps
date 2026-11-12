import Link from "next/link";

// Auth.js redirects here on any sign-in failure (expired/used link,
// provider error, etc.) via a `?error=` code. We intentionally don't
// branch on that code in the UI — it's a neutral message either way, so
// the page never confirms or denies whether an email/account exists.
export default function AuthErrorPage() {
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="mb-2 text-xl font-semibold">Не получилось войти</h1>
      <p className="mb-6 text-black/60">
        Ссылка для входа устарела или уже использована. Запроси новую — она
        придёт на тот же email.
      </p>
      <Link href="/" className="text-sm underline">
        Вернуться и попробовать снова
      </Link>
    </main>
  );
}
