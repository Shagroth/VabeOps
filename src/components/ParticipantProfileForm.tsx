"use client";

import { useState, useTransition } from "react";
import { updateMyProfile } from "@/app/stream/actions";

export function ParticipantProfileForm({
  initial,
}: {
  initial: { doingNow: string; exploring: string; canHelpWith: string };
}) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await updateMyProfile(formData);
          setSaved(true);
        });
      }}
      className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 text-sm"
    >
      <span className="font-medium">Твой профиль в потоке</span>
      <label className="flex flex-col gap-1">
        Что делаю
        <input
          name="doingNow"
          defaultValue={initial.doingNow}
          onChange={() => setSaved(false)}
          className="rounded border border-black/15 p-1.5"
        />
      </label>
      <label className="flex flex-col gap-1">
        Что исследую
        <input
          name="exploring"
          defaultValue={initial.exploring}
          onChange={() => setSaved(false)}
          className="rounded border border-black/15 p-1.5"
        />
      </label>
      <label className="flex flex-col gap-1">
        Где могу помочь
        <input
          name="canHelpWith"
          defaultValue={initial.canHelpWith}
          onChange={() => setSaved(false)}
          className="rounded border border-black/15 p-1.5"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded border border-black/15 px-3 py-1"
      >
        {isPending ? "Сохраняю..." : saved ? "Сохранено ✓" : "Сохранить"}
      </button>
    </form>
  );
}
