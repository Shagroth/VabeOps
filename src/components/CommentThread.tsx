"use client";

import { useState, useTransition } from "react";
import { postComment } from "@/app/stream/actions";

export function CommentThread({
  moduleId,
  comments,
}: {
  moduleId: string;
  comments: { id: string; content: string; createdAt: Date; user: { email: string } }[];
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      {comments.map((c) => (
        <div key={c.id} className="text-sm">
          <span className="text-black/50 dark:text-white/50">{c.user.email}: </span>
          {c.content}
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-sm text-black/40 dark:text-white/40">Обсуждения пока нет.</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await postComment(moduleId, content);
            setContent("");
          });
        }}
        className="flex gap-2"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Написать в обсуждение недели..."
          className="flex-1 rounded-lg border border-black/15 p-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 disabled:opacity-50"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
