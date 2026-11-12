"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function MarkdownField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Содержание (Markdown)</span>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="rounded-md border border-hairline px-2.5 py-1 text-xs text-graphite-muted hover:text-graphite"
        >
          {preview ? "Редактировать" : "Предпросмотр"}
        </button>
      </div>
      {preview ? (
        <div className="prose prose-sm max-w-none rounded-lg border border-hairline bg-white/60 p-4 prose-headings:font-semibold">
          <ReactMarkdown>{value || "*Пусто*"}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={14}
          maxLength={20000}
          className="w-full rounded-lg border border-hairline p-3 font-mono text-sm"
        />
      )}
      {preview && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
