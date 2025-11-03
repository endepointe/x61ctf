/*
import welcomeTo from "./welcome-to.svg"
import logo from "./logo.svg";
import logo2 from "./logo2.svg";
import comingSoon from "./comingsoon.svg";
*/

// Animated versions (your originals with animation)
import welcomeToAnimated from "./welcome-to.svg";
import comingSoonAnimated from "./comingsoon.svg";
import logo2 from "./logo2.svg";

// Compat (patched) versions for iOS/Edge-Mobile
import welcomeToCompat from "./welcome-to-compat.svg";
import comingSoonCompat from "./comingsoon-compat.svg";

import { useEffect, useMemo, useState } from "react";

function useSvgCompatPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      setReducedMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
  }, []);

  const ua = navigator.userAgent || "";
  const platform = (navigator as any).platform || "";
  const maxTouch = (navigator as any).maxTouchPoints || 0;

  // iOS (all browsers on iOS use WebKit)
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && maxTouch > 1); // iPadOS reports as Mac

  // Edge Mobile (Chromium Edge on Android/iOS)
  const isEdgeMobile = /Edg\//.test(ua) && /Mobile|Android|iPhone|iPad|iPod/.test(ua);

  // Optional: allow manual override for testing (?svg=compat or ?svg=anim)
  const params = new URLSearchParams(window.location.search);
  const override = params.get("svg"); // "compat" | "anim" | null

  return useMemo(() => {
    if (override === "compat") return true;
    if (override === "anim") return false;
    return reducedMotion || isIOS || isEdgeMobile;
  }, [override, reducedMotion, isIOS, isEdgeMobile]);
}

export default function Welcome() {
  const useCompat = useSvgCompatPreference();

  const welcomeToSrc = useMemo(
    () => (useCompat ? welcomeToCompat : welcomeToAnimated),
    [useCompat]
  );
  const comingSoonSrc = useMemo(
    () => (useCompat ? comingSoonCompat : comingSoonAnimated),
    [useCompat]
  );

  return (
    <main className="min-h-screen flex justify-center pt-16 pb-6 px-4 sm:px-6">
      <div className="w-full max-w-5xl flex flex-col items-center gap-10 sm:gap-14">
        <header className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="w-40 sm:w-48 md:w-52 max-w-full shrink-0">
            <img
              src={welcomeToSrc}
              alt="welcome to"
              className="hidden w-full dark:block"
            />
          </div>

          <div className="w-60 sm:w-72 md:w-80 max-w-full p-2 sm:p-4">
            <img
              src={logo2}
              alt="x61ctf"
              className="hidden w-full dark:block"
            />
          </div>
        </header>

        <pre className="w-full rounded-lg border border-zinc-700/40 p-3 sm:p-4 text-xs sm:text-sm md:text-base overflow-x-auto">
          <code className="language-python">{`cipher1 = 1001
cipher2 = 0111
print("recover the keyspace and plaintexts")`}</code>
        </pre>

        <div className="w-full flex flex-col items-center">
          <img
            src={comingSoonSrc}
            alt="Coming soon (eta 30 days)"
            className="hidden dark:block w-full max-w-xs sm:max-w-md md:max-w-2xl"
          />
        </div>
      </div>
    </main>
  );
}
