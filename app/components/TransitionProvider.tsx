"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_SHOW_MS = 700; // loading screen shows at least this long (ms)
const FADE_MS = 350;     // fade-out duration

/**
 * Wraps the entire app (in layout.tsx) and shows a full-screen loading overlay
 * on every internal-link navigation.
 *
 * Flow:
 *   click <Link> → show overlay immediately
 *   server fetches new page
 *   pathname changes (page is ready) → wait for MIN_SHOW_MS, then fade out
 */
export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  const [phase, setPhase] = useState<"hidden" | "visible" | "fading">("hidden");
  const [progress, setProgress] = useState(0);

  const showAt = useRef(0);
  const progressTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── helpers ──────────────────────────────────────────────────────────────

  function clearProgressTimers() {
    progressTimers.current.forEach(clearTimeout);
    progressTimers.current = [];
  }

  function show() {
    clearProgressTimers();
    showAt.current = Date.now();
    setProgress(0);
    setPhase("visible");

    // Natural-looking progress that slows near 85%
    const steps = [
      { v: 25, ms: 100 },
      { v: 50, ms: 300 },
      { v: 68, ms: 600 },
      { v: 80, ms: 1000 },
      { v: 87, ms: 1600 },
    ];
    steps.forEach(({ v, ms }) => {
      progressTimers.current.push(setTimeout(() => setProgress(v), ms));
    });
  }

  function hide() {
    clearProgressTimers();
    const elapsed = Date.now() - showAt.current;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setPhase("fading");
        setTimeout(() => {
          setPhase("hidden");
          setProgress(0);
        }, FADE_MS);
      }, 200); // let bar reach 100% before fade
    }, wait);
  }

  // ── detect pathname change (navigation complete) ─────────────────────────

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      if (phase === "visible") hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── detect link click (navigation start) ────────────────────────────────

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      // Same page — skip
      const targetPath = href.split("?")[0];
      if (targetPath === pathname) return;

      show();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <>
      {phase !== "hidden" && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase === "fading" ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        >
          {/* Top progress bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "3px",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #09418C 0%, #1a6fd4 50%, #09418C 100%)",
              backgroundSize: "200% 100%",
              borderRadius: "0 2px 2px 0",
              boxShadow: "0 0 12px rgba(9,65,140,0.45)",
              transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
              animation: "loading-shimmer 1.6s linear infinite",
            }}
          />

          {/* Logo + dots */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              animation: "loading-rise 0.45s cubic-bezier(0.4,0,0.2,1) both",
            }}
          >
            <Image
              src="/img/logo.svg"
              alt="Palm Springs"
              width={180}
              height={56}
              priority
              style={{ filter: "drop-shadow(0 4px 16px rgba(9,65,140,0.12))" }}
            />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {[0, 160, 320].map((delay) => (
                <span
                  key={delay}
                  className="loading-dot"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
