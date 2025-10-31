import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState, useEffect, useCallback } from "react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

/** === Inline SVG icons (crypto / RE theme) === */
function IconShieldKeyhole(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 2l7 3v6.2c0 4.9-3.1 9.3-7 10.8-3.9-1.5-7-5.9-7-10.8V5l7-3z" />
      <circle cx="12" cy="10" r="2.25" fill="currentColor" />
      <rect x="11.25" y="12.5" width="1.5" height="3.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}
function IconCipherWheel(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r1 = 8.7,
          r2 = 10;
        const x1 = 12 + r1 * Math.cos(a);
        const y1 = 12 + r1 * Math.sin(a);
        const x2 = 12 + r2 * Math.cos(a);
        const y2 = 12 + r2 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
      })}
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
function IconWaveProbe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M4.5 12h3l1.3-3.2 2.2 7 2.1-6 1.7 4.2h3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.5 15.5l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21.7" cy="18.7" r="1" fill="currentColor" />
    </svg>
  );
}
function IconKeycard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <rect x="5.5" y="9" width="7.5" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="5.5" y="12.2" width="4.5" height="1.8" rx="0.9" fill="currentColor" opacity="0.85" />
      <circle cx="17" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}
function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** === Nav Component with collapsible mobile drawer === */
function Nav() {
  const [open, setOpen] = useState(false);

  // Close on route change: clicking any link collapses the drawer
  const handleLinkClick = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400/70";
  const idle = "text-zinc-300 hover:text-white hover:bg-zinc-800/60";
  const active = "text-emerald-300 bg-zinc-800/60 ring-1 ring-emerald-500/40 hover:text-emerald-200 hover:bg-zinc-800";
  const linkClass = ({ isActive }: { isActive: boolean }) => `${base} ${isActive ? active : idle}`;
  const iconCls = "h-4.5 w-4.5 flex-none";

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-zinc-800/70 bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/55"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 md:px-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <IconShieldKeyhole className="h-5 w-5 text-emerald-400" />
          <span className="tracking-wide">x61ctf</span>
          <span className="hidden text-zinc-500 sm:inline">•</span>
          <span className="hidden text-zinc-400 sm:inline">crypto &amp; RE</span>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/" end className={linkClass} onClick={handleLinkClick}>
            <IconShieldKeyhole className={iconCls} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/trending" end className={linkClass} onClick={handleLinkClick}>
            <IconWaveProbe className={iconCls} />
            <span>Trending</span>
          </NavLink>
          <NavLink to="/concerts" className={linkClass} onClick={handleLinkClick}>
            <IconCipherWheel className={iconCls} />
            <span>All Concerts</span>
          </NavLink>
          <NavLink to="/account" className={linkClass} onClick={handleLinkClick}>
            <IconKeycard className={iconCls} />
            <span>Account</span>
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-200 hover:bg-zinc-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`sm:hidden origin-top overflow-hidden border-t border-zinc-800/70 bg-zinc-900/95 backdrop-blur transition-[max-height,opacity] duration-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 py-2">
          <div className="flex flex-col gap-1 py-1">
            <NavLink to="/" end className={linkClass} onClick={handleLinkClick}>
              <IconShieldKeyhole className={iconCls} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/rules" end className={linkClass} onClick={handleLinkClick}>
              <IconWaveProbe className={iconCls} />
              <span>Rules(todo)</span>
            </NavLink>
            <NavLink to="/challenges" className={linkClass} onClick={handleLinkClick}>
              <IconCipherWheel className={iconCls} />
              <span>Challenges</span>
            </NavLink>
            <NavLink to="/account" className={linkClass} onClick={handleLinkClick}>
              <IconKeycard className={iconCls} />
              <span>Account(todo)</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Nav />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function HydrateFallback() {
  return (<div>TODO: fallback</div>);
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
