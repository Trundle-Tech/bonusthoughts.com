"use client";

import { useEffect, useRef } from "react";
import { trackTimeOnPage } from "@/lib/analytics";

export function useTimeTracking(pageName: string) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    // Track time when user leaves page
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(pageName, timeSpent);
    };

    // Track when visibility changes (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(pageName, timeSpent);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Also track on unmount (navigation)
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage(pageName, timeSpent);
      }
    };
  }, [pageName]);
}
