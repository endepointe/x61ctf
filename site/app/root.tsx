import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

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

/** Inline SVG icons (crypto / RE theme) */
function IconShieldKeyhole(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2l7 3v6.2c0 4.9-3.1 9.3-7 10.8-3.9-1.5-7-5.9-7-10.8V5l7-3z"
        opacity="0.9"
      />
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
      {/* tick marks hinting at substitution wheel */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r1 = 8.7, r2 = 10;
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
      {/* probe tip */}
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
      {/* NFC keyhole */}
      <circle cx="17" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

function Nav() {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400/70";
  const idle =
    "text-zinc-300 hover:text-white hover:bg-zinc-800/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800";
  const active =
    "text-emerald-300 bg-zinc-800/60 ring-1 ring-emerald-500/40 hover:text-emerald-200 hover:bg-zinc-800";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? active : idle}`;

  const iconCls = "h-4.5 w-4.5 flex-none";

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-zinc-800/70 bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/55"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 md:px-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          {/* Small lock-shield brand icon */}
          <IconShieldKeyhole className="h-5 w-5 text-emerald-400" />
          <span className="tracking-wide">x61ctf</span>
          <span className="hidden text-zinc-500 sm:inline">•</span>
          <span className="hidden text-zinc-400 sm:inline">crypto, web &amp; rev</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={linkClass} aria-label="home">
            <IconShieldKeyhole className={iconCls} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/challenges" className={linkClass} aria-label="challenges">
            <IconCipherWheel className={iconCls} />
            <span>All Challenges</span>
          </NavLink>

          <NavLink to="/rules" end className={linkClass} aria-label="rules">
            <IconWaveProbe className={iconCls} />
            <span>Rules(todo)</span>
          </NavLink>

          <NavLink to="/account" className={linkClass} aria-label="account">
            <IconKeycard className={iconCls} />
            <span>Account(todo)</span>
          </NavLink>
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
