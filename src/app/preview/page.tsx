import Link from "next/link";
import { requirePreviewEnv } from "./guard";

const PAGES = [
  { href: "/preview/dashboard", title: "Обзор (зачислен)", detail: "Недельный прогресс, следующий шаг, ближайшая встреча — с реальными демо-статусами." },
  { href: "/preview/no-cohort", title: "Обзор (без когорты)", detail: "Честное состояние для подтверждённого аккаунта без зачисления." },
  { href: "/preview/practice", title: "Урок и практика", detail: "Степпер «Разбор решения», блок «Изменились условия», история версий." },
];

export default function PreviewIndexPage() {
  requirePreviewEnv();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Preview</h1>
        <p className="text-sm text-graphite-muted">
          Статичные демо-состояния воркспейса для разработчика/админа — на фикстурных данных,
          без обращений к базе. Недоступно на продакшене (эта проверка — по{" "}
          <code className="font-mono text-xs">NODE_ENV</code>).
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="block rounded-xl border border-hairline bg-white/50 p-4 transition-colors duration-150 hover:bg-white"
            >
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-graphite-muted">{p.detail}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
