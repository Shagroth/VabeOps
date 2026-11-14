import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kitegrip.com"),
  title: {
    default: "KiteGrip — школа работы с ИИ-агентами",
    template: "%s — KiteGrip",
  },
  description:
    "KiteGrip учит работать с ИИ-агентами так, чтобы результат оставался твоим: постановка задачи, context engineering, MCP, guardrails и проверка по существу.",
  applicationName: "KiteGrip",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "KiteGrip",
    title: "KiteGrip — Let it fly. Keep your grip.",
    description:
      "ИИ летит быстро. Хватка — твоя. Школа работы с ИИ-агентами: сейчас идёт набор в закрытый бесплатный пилот KiteGrip for Engineers.",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
