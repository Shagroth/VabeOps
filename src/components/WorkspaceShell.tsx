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

export function WorkspaceShell({
  active,
  email,
  isAdmin,
  children,
}: {
  active: NavKey;
  email: string;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[240px] flex-shrink-0 flex-col justify-between border-r border-hairline px-4 py-6 lg:flex">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 px-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="5" cy="19" r="2" fill="var(--system)" />
              <path d="M7 18 L17 7" stroke="var(--accent-action)" strokeWidth="1.6" fill="none" />
              <circle cx="19" cy="5" r="2" fill="var(--accent-action)" />
            </svg>
            <span className="font-medium">Vibe Ops</span>
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
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                active === "admin"
                  ? "bg-black/5 font-medium text-graphite"
                  : "text-graphite-muted hover:bg-black/5 hover:text-graphite"
              }`}
            >
              Admin
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
            <path d="M7 18 L17 7" stroke="var(--accent-action)" strokeWidth="1.6" fill="none" />
            <circle cx="19" cy="5" r="2" fill="var(--accent-action)" />
          </svg>
          <span className="text-sm font-medium">Vibe Ops</span>
        </Link>
        <nav className="flex gap-1 text-xs">
          {NAV.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={active === item.key}
              className="rounded-md px-2.5 py-1.5 transition-colors duration-150"
            />
          ))}
        </nav>
      </div>

      <main className="min-h-screen flex-1 px-5 pb-16 pt-20 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
