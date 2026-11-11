export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-8 text-xs text-graphite-muted lg:px-10">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <span>Vibe Ops · когортный пилот</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
