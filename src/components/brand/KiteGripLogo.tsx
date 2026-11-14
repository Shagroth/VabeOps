import { KiteGripMark, type KiteGripMarkTone } from "./KiteGripMark";

type Props = {
  tone?: Exclude<KiteGripMarkTone, "sky">;
  /** `md` is the header size from the brand sheet, `sm` fits footers and sidebars. */
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: { mark: "h-9 w-auto", word: "text-[20px]", gap: "gap-2.5" },
  md: { mark: "h-12 w-auto", word: "text-[26px]", gap: "gap-3" },
} as const;

/** Compact mark plus the lowercase wordmark. The wordmark carries the name, so the mark is decorative. */
export function KiteGripLogo({ tone = "light", size = "md", className = "" }: Props) {
  const s = SIZES[size];
  return (
    <span className={`kg-logo inline-flex items-center ${s.gap} ${className}`}>
      <KiteGripMark variant="compact" tone={tone} className={`kg-logo-mark ${s.mark}`} />
      <span className={`font-extrabold leading-none tracking-[-0.03em] ${s.word}`}>kitegrip</span>
    </span>
  );
}
