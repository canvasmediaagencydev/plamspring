"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows a top progress bar whenever the user navigates between pages.
 * Listens to pathname changes (Next.js App Router) and runs a natural-looking
 * progress animation that completes when the new page mounts.
 */
export default function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const prevPath = useRef(pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function start() {
    clearTimers();
    setWidth(0);
    setVisible(true);

    // Advance to 80% quickly, then slow down (waiting feel)
    timers.current.push(setTimeout(() => setWidth(30), 80));
    timers.current.push(setTimeout(() => setWidth(55), 300));
    timers.current.push(setTimeout(() => setWidth(72), 700));
    timers.current.push(setTimeout(() => setWidth(85), 1200));
  }

  function finish() {
    clearTimers();
    setWidth(100);
    timers.current.push(
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400)
    );
  }

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Kick off the bar immediately on first load / link click
  // by watching the pathname departure
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      if (href !== pathname) start();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        height: "3px",
        width: `${width}%`,
        background: "linear-gradient(90deg, #09418C 0%, #1a6fd4 60%, #09418C 100%)",
        backgroundSize: "200% 100%",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 10px rgba(9, 65, 140, 0.5)",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        animation: "loading-shimmer 1.6s linear infinite",
        opacity: width === 100 ? 0 : 1,
      }}
    />
  );
}
