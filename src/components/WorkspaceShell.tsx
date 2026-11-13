import Link from "next/link";

type NavKey = "overview" | "program" | "stream" | "admin";

const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: "overview", href: "/", label: "Обзор" },
  { key: "program", href: "/modules", label: "Программа" },
  { key: "stream", href: "/stream", label: "Поток" },
];

function NavLink({
  item,
  active,
  className,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  className: string;
}) {
  return (
    <Link
      href={item.href}
      className={`${className} ${
        active
          ? "bg-black/5 font-medium text-graphite"
          : "text-graphite-muted hover:bg-black/5 hover:text-graphite"
      }`}
    >
      {item.label}
    </Link>
  );
}

const NAV_LABEL: Record<NavKey, string> = {
  overview: "Обзор",
  program: "Программа",
  stream: "Поток",
  admin: "Admin",
};

export function WorkspaceShell({
  active,
  email,
  canAccessStudio,
  canReviewSubmissions = false,
  breadcrumb,
  children,
}: {
  active: NavKey;
  email: string;
  /** Any Studio role (Admin/Editor/Author) — not Mentor, see studio-permissions.ts. */
  canAccessStudio: boolean;
  /** ADMIN or MENTOR — shows the cross-cohort review queue link. */
  canReviewSubmissions?: boolean;
  /** e.g. cohort name or "Неделя 2" — shown in the desktop top bar next to the section label */
  breadcrumb?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1">
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 -translate-y-16 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink transition-transform duration-150 focus:translate-y-0"
      >
        Перейти к содержанию
      </a>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[240px] flex-shrink-0 flex-col justify-between border-r border-hairline px-4 py-6 lg:flex">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 px-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="5" cy="19" r="2" fill="var(--system)" />
              <path d="M7 18 L17 7" stroke="var(--system)" strokeWidth="1.6" fill="none" />
              <circle cx="19" cy="5" r="2" fill="var(--system)" />
            </svg>
            <span className="font-medium">VabeOps</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                active={active === item.key}
                className="rounded-lg px-3 py-2 text-sm transition-colors duration-150"
              />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-hairline pt-4">
          {canReviewSubmissions && (
            <Link
              href="/admin/review"
              className="rounded-lg px-3 py-2 text-sm text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite"
            >
              На проверке
            </Link>
          )}
          {canAccessStudio && (
            <Link
              href="/studio"
              className={`rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                active === "admin"
                  ? "bg-black/5 font-medium text-graphite"
                  : "text-graphite-muted hover:bg-black/5 hover:text-graphite"
              }`}
            >
              Studio
            </Link>
          )}
          <div className="truncate px-3 py-1 text-xs text-graphite-muted">{email}</div>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/auth");
              await signOut();
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite"
            >
              Выйти
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-hairline bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="5" cy="19" r="2" fill="var(--system)" />
            <path d="M7 18 L17 7" stroke="var(--system)" strokeWidth="1.6" fill="none" />
            <circle cx="19" cy="5" r="2" fill="var(--system)" />
          </svg>
          <span className="text-sm font-medium">VabeOps</span>
        </Link>
        <div className="flex items-center gap-1 text-xs">
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                active={active === item.key}
                className="rounded-md px-2.5 py-1.5 transition-colors duration-150"
              />
            ))}
          </nav>
          {/* Sign-out, Studio and the review queue live in the desktop sidebar's
              bottom section; the mobile bar has no room for them inline, so
              they go behind this disclosure instead of becoming unreachable. */}
          <details className="relative">
            <summary className="list-none rounded-md px-2.5 py-1.5 text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite [&::-webkit-details-marker]:hidden">
              Ещё
            </summary>
            <div className="absolute right-0 top-full z-30 mt-1 flex w-48 flex-col gap-1 rounded-lg border border-hairline bg-paper p-2 text-sm shadow-lg">
              {canReviewSubmissions && (
                <Link
                  href="/admin/review"
                  className="rounded-md px-2 py-1.5 text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite"
                >
                  На проверке
                </Link>
              )}
              {canAccessStudio && (
                <Link
                  href="/studio"
                  className="rounded-md px-2 py-1.5 text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite"
                >
                  Studio
                </Link>
              )}
              <div className="truncate border-t border-hairline px-2 pt-1.5 text-xs text-graphite-muted">
                {email}
              </div>
              <form
                action={async () => {
                  "use server";
                  const { signOut } = await import("@/auth");
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-md px-2 py-1.5 text-left text-graphite-muted transition-colors duration-150 hover:bg-black/5 hover:text-graphite"
                >
                  Выйти
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>

      <main id="main-content" className="min-h-screen flex-1 px-5 pb-16 pt-20 lg:px-10 lg:pt-0">
        <div className="hidden items-center gap-2 border-b border-hairline py-4 text-sm text-graphite-muted lg:flex">
          <span>{NAV_LABEL[active]}</span>
          {breadcrumb && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-graphite">{breadcrumb}</span>
            </>
          )}
        </div>
        <div className="lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
