"use client";

import { useEffect } from "react";

// Warns on tab close/navigation away if any input on the page changed
// since the last submit — scoped to the single edit form each Studio
// detail page renders, not a generic app-wide guard.
export function UnsavedChangesGuard() {
  useEffect(() => {
    let dirty = false;
    const onInput = () => {
      dirty = true;
    };
    const onSubmit = () => {
      dirty = false;
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    document.addEventListener("input", onInput, true);
    document.addEventListener("submit", onSubmit, true);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return null;
}
