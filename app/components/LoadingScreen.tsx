"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Full-screen loading overlay shown while page data is being fetched.
 * Design matches Palm Springs brand: white bg, primary blue (#09418C), Montserrat font.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(15);

  // Simulate a natural-looking progress that slows near 90%
  useEffect(() => {
    const steps = [
      { target: 40, delay: 200 },
      { target: 65, delay: 500 },
      { target: 80, delay: 900 },
      { target: 90, delay: 1400 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="loading-screen">
      {/* Top progress bar */}
      <div className="loading-bar" style={{ width: `${progress}%` }} />

      {/* Center content */}
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo">
          <Image
            src="/img/logo.svg"
            alt="Palm Springs"
            width={180}
            height={56}
            priority
          />
        </div>

        {/* Animated dots */}
        <div className="loading-dots">
          <span className="loading-dot" style={{ animationDelay: "0ms" }} />
          <span className="loading-dot" style={{ animationDelay: "160ms" }} />
          <span className="loading-dot" style={{ animationDelay: "320ms" }} />
        </div>
      </div>
    </div>
  );
}
