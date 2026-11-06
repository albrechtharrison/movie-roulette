"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // avoid caching stale chunks during dev
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // offline/installability is a nice-to-have, not critical
    });
  }, []);

  return null;
}
