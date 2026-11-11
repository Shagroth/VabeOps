import Link from "next/link";

export function WorkspaceNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="flex gap-4 text-sm">
      <Link href="/" className="rounded-lg border border-black/15 px-3 py-1.5">
        Обзор
      </Link>
      <Link
        href="/modules"
        className="rounded-lg border border-black/15 px-3 py-1.5"
      >
        Программа
      </Link>
      <Link
        href="/stream"
        className="rounded-lg border border-black/15 px-3 py-1.5"
      >
        Поток
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="rounded-lg border border-black/15 px-3 py-1.5"
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
