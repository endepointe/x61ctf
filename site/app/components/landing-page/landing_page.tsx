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

export default function LandingPage() {
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
    <section className="landing" aria-labelledby="ctf-title">
      <header className="hero">
        <div className="hero__inner">
          <p className="hero__kicker">CTF Platform</p>
          <h1 id="ctf-title" className="hero__title">Learn by breaking things—safely.</h1>
          <p className="hero__subtitle">
            This site exists to expand curiosity and practical skill across reverse engineering, malware analysis,
            digital forensics, cryptography, networking, operating system security, and game theory.
          </p>

          <div className="hero__cta">
            <a className="btn btn--primary" href="#challenges">Explore Challenges</a>
            <a className="btn btn--ghost" href="#scoreboard">View Scoreboard</a>
          </div>

          <p className="hero__note">
            You can play without an account. Authenticating unlocks more advanced challenge types and platform features.
          </p>
        </div>
      </header>

      <main className="content">
        <section className="card" id="goals" aria-labelledby="goals-title">
          <h2 id="goals-title" className="card__title">Goals</h2>
          <p className="card__text">
            The platform is designed around hands-on experimentation and measurable progress. Each challenge is meant to
            develop a specific technical muscle—analysis, exploitation, reasoning, tradeoffs, and communication.
          </p>

          <ul className="pill-list" aria-label="Focus areas">
            <li className="pill">Reverse Engineering</li>
            <li className="pill">Malware Analysis</li>
            <li className="pill">Digital Forensics</li>
            <li className="pill">Cryptography</li>
            <li className="pill">Networking</li>
            <li className="pill">OS Security</li>
            <li className="pill">Game Theory</li>
          </ul>
        </section>

        <section className="grid" id="challenges" aria-labelledby="challenges-title">
          <div className="card">
            <h2 id="challenges-title" className="card__title">Challenges</h2>
            <p className="card__text">
              Everyone gets access to challenges. The difference is how far the platform can go in making the experience
              interactive and personalized.
            </p>

            <div className="split" role="list">
              <article className="panel" role="listitem" aria-labelledby="unauth-title">
                <h3 id="unauth-title" className="panel__title">Unauthenticated players</h3>
                <p className="panel__text">
                  Browse and attempt a core set of challenges right away—no account required.
                </p>
                <ul className="panel__list">
                  <li><strong>Challenge access:</strong> Available</li>
                  <li>
                    <strong>Challenge types:</strong> Primarily text-based / API-style prompts, writeups, and puzzles that
                    don’t require per-user compute resources
                  </li>
                  <li>
                    <strong>Progress tracking:</strong> Limited (authentication enables stronger persistence and attribution)
                  </li>
                </ul>
              </article>

              <article className="panel panel--accent" role="listitem" aria-labelledby="auth-title">
                <h3 id="auth-title" className="panel__title">Authenticated players</h3>
                <p className="panel__text">
                  Signing in allows the platform to offer more interesting challenge mechanics and a richer player
                  experience.
                </p>
                <ul className="panel__list">
                  <li><strong>Everything above</strong>, plus:</li>
                  <li>
                    <strong>Advanced challenge types:</strong> interactive problems, personalized instances, gated content,
                    and challenges that may require stronger identity guarantees
                  </li>
                  <li><strong>Stronger scoring and attribution:</strong> consistent identity for leaderboards and events</li>
                  <li>
                    <strong>Better platform features:</strong> saved progress, submissions history, and future
                    team/event-based play (where enabled)
                  </li>
                </ul>

                <p className="panel__fineprint">
                  Authentication is optional, but recommended if you want the “full” CTF experience.
                </p>
              </article>
            </div>
          </div>

          <div className="card" id="scoreboard" aria-labelledby="scoreboard-title">
            <h2 id="scoreboard-title" className="card__title">Scoreboard</h2>
            <p className="card__text">
              The scoreboard tracks points and rankings across challenges and events. It’s designed to be a feedback
              mechanism—use it to measure growth, not just placement.
            </p>

            <ul className="checklist" aria-label="Scoreboard features">
              <li className="check">Global rankings (individual)</li>
              <li className="check">Event-specific boards (when active)</li>
              <li className="check">Challenge value based on difficulty</li>
              <li className="check">Clear rules and anti-abuse expectations</li>
            </ul>

            <p className="callout" role="note">
              Tip: If you want your solves reflected on the scoreboard, authenticate so the platform can reliably attribute
              submissions.
            </p>
          </div>
        </section>

        <section className="card" id="irc" aria-labelledby="irc-title">
          <h2 id="irc-title" className="card__title">IRC</h2>
          <p className="card__text">
            IRC is the community space for questions, collaboration, and learning. If you’re stuck, want to sanity-check an
            approach, or just want to meet other players, join the channel.
          </p>

          <div className="irc">
            <div className="irc__block" aria-label="IRC connection information">
              <div className="irc__row">
                <span className="irc__label">Server</span>
                <code className="irc__value">irc.example.org</code>
              </div>
              <div className="irc__row">
                <span className="irc__label">Port</span>
                <code className="irc__value">6697 (TLS) / 6667</code>
              </div>
              <div className="irc__row">
                <span className="irc__label">Channel</span>
                <code className="irc__value">#your-ctf</code>
              </div>
              <div className="irc__row">
                <span className="irc__label">Nickname</span>
                <code className="irc__value">pick-anything</code>
              </div>
            </div>

            <details className="irc__details">
              <summary className="irc__summary">Connection examples</summary>
              <div className="irc__examples" role="group" aria-label="IRC examples">
                <p className="irc__example-title">HexChat / graphical client</p>
                <p className="irc__example">
                  Add the server, enable SSL/TLS, connect, then join:
                  <code>/join #your-ctf</code>
                </p>

                <p className="irc__example-title">irssi (terminal)</p>
                <pre className="irc__pre"><code>/connect -ssl irc.example.org 6697
    /join #your-ctf</code></pre>

                <p className="irc__example-title">Expectations</p>
                <ul className="irc__bullets">
                  <li>Don’t post flags in public chat.</li>
                  <li>Ask for hints; explain what you tried.</li>
                  <li>Be respectful—everyone is here to learn.</li>
                </ul>
              </div>
            </details>
          </div>

          <p className="footnote">
            Replace the server/channel values above with your real IRC details before publishing.
          </p>
        </section>

        <footer className="footer" aria-label="Site footer">
          <p className="footer__text">
            Play unauthenticated to explore. Authenticate to unlock deeper challenge experiences. Join IRC to learn with
            others.
          </p>
        </footer>
      </main>
    </section>
  );
}
