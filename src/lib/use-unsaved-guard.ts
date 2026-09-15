"use client";

import { useEffect } from "react";

// Slice 17 (§9 — unsaved changes): the simplest reliable mechanism to warn an
// operator before work is lost. App Router has no supported route-change-
// interception hook, so this guards the browser close/refresh/navigate-away
// case (beforeunload) and leaves the persistent Cancel buttons as the
// intentional in-app exit. The visible "Unsaved changes" indicator is rendered
// by the calling form.
export function useUnsavedGuard(dirty: boolean, message?: string): void {
  useEffect(() => {
    if (!dirty) return;
    const text = message ?? "You have unsaved changes. Leave anyway?";
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome/Edge require returning a string-backed event; keeping it
      // explicit satisfies all modern browsers and sets the type correctly.
      e.returnValue = "";
      void text;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, message]);
}